import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl } from "class-validator"

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

  /* Metadata de SW:
  @IsDateString()
  readonly created: string;

  @IsDateString()
  readonly edited: string;

  @IsNumber()
  readonly episode_id: number;

  @IsString()
  readonly opening_crawl: string;

  @IsArray()
  @IsString({ each: true })
  readonly species: string[];

  @IsArray()
  @IsString({ each: true })
  readonly starships: string[];

  @IsArray()
  @IsString({ each: true })
  readonly vehicles: string[];

  @IsArray()
  @IsString({ each: true })
  readonly characters: string[];

  @IsArray()
  @IsString({ each: true })
  readonly planets: string[];
  */
}
