import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { DeepMockProxy } from 'jest-mock-extended';
import { createMockContext } from '@modules/prisma/test/prisma.mock.context';
import { createMovieDtoMock, movieMockFactory, updateMovieDtoMock } from './movies.mock';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DuplicatedResourceException, ResourceNotFoundException } from '@common/errors';
import { PRISMA_ERRORS } from '@modules/prisma/constants/constants';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let prismaService: DeepMockProxy<PrismaService>;

  const movie = movieMockFactory();
  const createMovieDto = createMovieDtoMock;
  const updateMovieDto = updateMovieDtoMock;

  beforeEach(async () => {
    prismaService = createMockContext().service;
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService,
        { provide: PrismaService, useValue: prismaService }
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      prismaService.movie.create.mockResolvedValue(movie);

      const result = await moviesService.create(createMovieDto);
      
      expect(prismaService.movie.create).toHaveBeenCalledWith({ data: createMovieDto });
      expect(result).toEqual(movie);
    });

    it('should throw DuplicatedResourceException if movie already exists', async () => {
      const prismaError = new PrismaClientKnownRequestError('Duplicated record', {
        code: PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED,
        clientVersion: ''
      });
      prismaService.movie.create.mockRejectedValue(prismaError);
      
      await expect(moviesService.create(createMovieDto)).rejects.toThrow(DuplicatedResourceException);
    });
  });
  
  describe('createMany', () => {
    it('should create multiple movies and return them', async () => {
      prismaService.movie.createManyAndReturn.mockResolvedValue([movie]);

      const result = await moviesService.createMany([createMovieDto])
      
      expect(prismaService.movie.createManyAndReturn).toHaveBeenCalledWith({
        data: [createMovieDto],
        skipDuplicates: true,
      });
      expect(result).toEqual([movie]);
    });
  });
  
    describe('update', () => {
      it('should update an existing movie', async () => {
        const {id, ...data} = updateMovieDto;
        const updatedMovie = {...movie, ...updateMovieDto};
        prismaService.movie.update.mockResolvedValue(updatedMovie);
  
        const result = await moviesService.update(id, updateMovieDto)
  
        expect(prismaService.movie.update).toHaveBeenCalledWith({ where: { id }, data });
        expect(result).toEqual(updatedMovie);
      });
  
      it('should throw ResourceNotFoundException if movie does not exist', async () => {
        const prismaError = new PrismaClientKnownRequestError('Record does not exist', {
          code: PRISMA_ERRORS.RECORD_DOES_NOT_EXIST,
          clientVersion: '',
        });
        prismaService.movie.update.mockRejectedValue(prismaError);
        
        await expect(moviesService.update(updateMovieDto.id, updateMovieDto)).rejects.toThrow(ResourceNotFoundException);
      });
    });
    
    describe('updateMany', () => {
      it('should update multiple movies', async () => {
        const updateMoviesDto = [updateMovieDto];
        prismaService.movie.update.mockResolvedValue(movie);

        const spy = jest.spyOn(moviesService, "update");
  
        const result = await moviesService.updateMany(updateMoviesDto);
  
        updateMoviesDto.forEach((movie, index) => {
          expect(spy).toHaveBeenNthCalledWith(index + 1, movie.id, movie)
        });
        expect(result).toEqual([movie]);
      });
    });
    
  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const page = 0;
      const size = 10;
      prismaService.movie.findMany.mockResolvedValue([movie]);

      const result = await moviesService.findAll(page, size);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({ skip: page * size, take: size });
      expect(result).toEqual([movie]);
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const id = movie.id;
      prismaService.movie.findUnique.mockResolvedValue(movie);

      const result = await moviesService.findOne(id);
      
      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(movie);
    });
  });
  
  describe('findOneByTitle', () => {
    it('should return a movie by title', async () => {
      const title = movie.title;
      prismaService.movie.findUnique.mockResolvedValue(movie);

      const result = await moviesService.findOneByTitle(title);

      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({ where: { title } });
      expect(result).toEqual(movie);
    });
  });
  
    describe('findManyByTitle', () => {
      it('should return multiple movies by titles', async () => {
        const title = movie.title;
        prismaService.movie.findMany.mockResolvedValue([movie]);
  
        const result = await moviesService.findManyByTitle([title]);
        
        expect(prismaService.movie.findMany).toHaveBeenCalledWith({
          where: { title: { in: [title] } },
        });
        expect(result).toEqual([movie]);
      });
    });

  describe('remove', () => {
    it('should delete a movie', async () => {
      const id = movie.id;
      prismaService.movie.delete.mockResolvedValue(movie);

      const result = await moviesService.remove(id);
      
      expect(prismaService.movie.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(movie);
    });

    it('should throw ResourceNotFoundException if movie does not exist', async () => {
      const prismaError = new PrismaClientKnownRequestError('Record does not exist', {
        code: PRISMA_ERRORS.RECORD_DOES_NOT_EXIST,
        clientVersion: '',
      });
      prismaService.movie.delete.mockRejectedValue(prismaError);
      
      await expect(moviesService.remove(movie.id)).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
