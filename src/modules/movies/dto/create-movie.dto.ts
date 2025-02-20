import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateMovieDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "Movie title must be unique.", example: "A New Hope" })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "George Lucas" })
  readonly director?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "Gary Kurtz, Rick McCallum" })
  readonly producer?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: "1977-05-25" })
  readonly release_date?: Date;

  @IsUrl()
  @ApiProperty({ description: "Url to the movie resource", example: "https://swapi.dev/api/films/1/" })
  readonly url: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({ description: "Json to store extra information available.", example: JSON.stringify({ "episode_id": 4, }) })
  metadata?: Record<string, any>;
}
