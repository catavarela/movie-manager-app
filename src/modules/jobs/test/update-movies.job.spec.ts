import { MoviesService } from '@modules/movies/movies.service';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import axios from 'axios';
import { UpdateMoviesJob } from '../update-movies.job';
import { swMovieMockFactory } from './update-movies.job.mock';

jest.mock('axios');

describe('UpdateMoviesJob', () => {
  let job: UpdateMoviesJob;
  const moviesService = {
    findManyByTitle: jest.fn(),
    updateMany: jest.fn(),
    createMany: jest.fn(),
  }
  const configService = {
    get: jest.fn().mockReturnValue('url'),
  }
  const axiosMock = axios as jest.Mocked<typeof axios>;
  
  const swMovie = swMovieMockFactory();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMoviesJob,
        { provide: MoviesService, useValue: moviesService },
        { provide: ConfigService, useValue: configService},
      ],
    }).compile();

    job = module.get<UpdateMoviesJob>(UpdateMoviesJob);
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('should fetch and process Star Wars movies', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        results: [swMovie],
        next: null,
      },
    });
    moviesService.findManyByTitle.mockResolvedValue([swMovie])

    const spy = jest.spyOn(job, 'createOrUpdateMovies' as any);

    await job.importStarWarsMovies();

    expect(axios.get).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith([swMovie]);
  });
});
