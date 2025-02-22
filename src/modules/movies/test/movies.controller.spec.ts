import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Movie, Role } from '@prisma/client';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { createMovieDtoMock, movieMockFactory, updateMovieDtoMock } from './movies.mock';
import { RolesGuard } from '@modules/users/guards/roles.guard';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  const moviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneByTitle: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  }
  const movie = movieMockFactory();
  const createMovieDto = createMovieDtoMock;
  const updateMovieDto = updateMovieDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: moviesService },
      ],
    })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    moviesController = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  describe('create', () => {
    it('should ensure role decorator is being applied to the method with ADMIN role', async () => {
      const roles = Reflect.getMetadata('roles', MoviesController.prototype.create);
      expect(roles).toEqual([Role.ADMIN]);
    });

    it('should create a movie and return it', async () => {
      const createdMovie: Movie = movie;
      moviesService.create.mockResolvedValue(createdMovie);

      const result = await moviesController.create(createMovieDto);

      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(createdMovie);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of movies', async () => {
      const page = 0;
      const size = 10;
      const movies: Movie[] = [movie];
      moviesService.findAll.mockResolvedValue(movies);

      const result = await moviesController.findAll(page, size);

      expect(moviesService.findAll).toHaveBeenCalledWith(page, size);
      expect(result).toEqual(movies);
    });
  });

  describe('findOneByTitle', () => {
    it('should return the movie by title', async () => {
      const title = movie.title;
      moviesService.findOneByTitle.mockResolvedValue(movie);
      
      const result = await moviesController.findOneByTitle(title);

      expect(moviesService.findOneByTitle).toHaveBeenCalledWith(title)
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie is not found by title', async () => {
      const title = 'NonExistentMovie';
      moviesService.findOneByTitle.mockResolvedValue(undefined);

      await expect(moviesController.findOneByTitle(title)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return the movie by uuid', async () => {
      const id = movie.id;
      moviesService.findOne.mockResolvedValue(movie);

      const result = await moviesController.findOne(id);

      expect(moviesService.findOne).toHaveBeenCalledWith(id)
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie is not found by uuid', async () => {
      const id = 'nonexistent-uuid';
      moviesService.findOne.mockResolvedValue(undefined);

      await expect(moviesController.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should ensure role decorator is being applied to the method with ADMIN role', async () => {
      const roles = Reflect.getMetadata('roles', MoviesController.prototype.create);
      expect(roles).toEqual([Role.ADMIN]);
    });

    it('should delete the movie and return success message', async () => {
      const id = movie.id;
      moviesService.remove.mockResolvedValue(movie);

      const result = await moviesController.remove(id);

      expect(moviesService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(movie);
    });
  });

  describe('update', () => {
    it('should ensure role decorator is being applied to the method with ADMIN role', async () => {
      const roles = Reflect.getMetadata('roles', MoviesController.prototype.create);
      expect(roles).toEqual([Role.ADMIN]);
    });

    it('should update the movie and return the updated movie', async () => {
      const id = updateMovieDto.id;
      const updatedMovie = {...movie, ...updateMovieDto}
      moviesService.update.mockResolvedValue(updatedMovie);

      const result = await moviesController.update(id, updateMovieDto)

      expect(moviesService.update).toHaveBeenCalledWith(id, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('guards', () => {
    it('should ensure auth guard is being applied to the controller', async () => {
      const guards = Reflect.getMetadata('__guards__', MoviesController)
      expect(guards.some(guard => new (guard) instanceof AuthGuard)).toBe(true)
    });

    it('should ensure role guard is being applied to the controller', async () => {
      const guards = Reflect.getMetadata('__guards__', MoviesController)
      expect(guards.some(guard => new (guard) instanceof RolesGuard)).toBe(true)
    });
  })
});