import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsUUID()
  id: string;
  
  @Exclude()
  readonly createdAt?: never;

  @Exclude()
  readonly updatedAt?: never;
}
