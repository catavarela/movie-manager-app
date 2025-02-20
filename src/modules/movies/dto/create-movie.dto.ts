import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateMovieDto {

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly director?: string;

  @IsString()
  @IsOptional()
  readonly producer?: string;

  @IsDateString()
  @IsOptional()
  readonly release_date?: Date;

  @IsUrl()
  readonly url: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
