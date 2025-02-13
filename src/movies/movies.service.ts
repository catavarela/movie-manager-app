import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  findAll() {
    return `This action returns all movies`;
  }

  findOne(title: string) {
    return `This action returns a #${title} movie`;
  }

  update(title: string, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${title} movie`;
  }

  remove(title: string) {
    return `This action removes a #${title} movie`;
  }
}
