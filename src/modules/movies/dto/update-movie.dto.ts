import { CreateMovieDto } from './create-movie.dto';
import { IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsUUID()
  @ApiProperty({ example: "7bcefd39-5f35-45f7-88ae-71e01469cd88" })
  id: string;
  
  @Exclude()
  readonly createdAt?: never;

  @Exclude()
  readonly updatedAt?: never;
}
