import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PRISMA_ERRORS } from '../prisma/constants/constants';
import { DuplicatedResourceException, ResourceNotFoundException } from 'src/common/errors/exceptions';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService){}

  create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({ data: createMovieDto }).catch(error => {
      if(error instanceof PrismaClientKnownRequestError && error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED){
        throw new DuplicatedResourceException(ERROR_MSG_MOVIES.DUPLICATED_MOVIE);
      }
    });
}

  createMany(createMoviesDto: CreateMovieDto[]) {
    return this.prisma.movie.createManyAndReturn({ data: createMoviesDto, skipDuplicates: true, });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    const {id: _, ...data} = updateMovieDto;

    return this.prisma.movie.update({
      where: { id },
      data
    }).catch(error => {
      if(error instanceof PrismaClientKnownRequestError && error.code === PRISMA_ERRORS.RECORD_TO_DOES_NOT_EXIST){
        throw new ResourceNotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
      }
    });
  }

  updateMany(updateMoviesDto: UpdateMovieDto[]) {
    return Promise.all(updateMoviesDto.map(movie => this.update(movie.id, movie)));
  }

  findAll(page: number, size: number) {
    return this.prisma.movie.findMany({ skip: page, take: size });
  }

  findOne(id: string) {
    return this.prisma.movie.findUnique({ where: { id } });
  }

  findOneByTitle(title: string) {
    return this.prisma.movie.findUnique({ where: { title } });
  }

  findManyByTitle(titles: string[]){
    return this.prisma.movie.findMany({
      where: {
        title: {
          in: titles
        }
      }
    })
  }

  remove(id: string) {
    return this.prisma.movie.delete({ where: { id } }).catch(error => {
      if(error instanceof PrismaClientKnownRequestError && error.code === PRISMA_ERRORS.RECORD_TO_DOES_NOT_EXIST){
        throw new ResourceNotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
      }
    });
  }
}
