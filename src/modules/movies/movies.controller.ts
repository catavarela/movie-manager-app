import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, HttpStatus, HttpCode, UseGuards, ConflictException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Role, Movie } from '@prisma/client';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '@modules/users/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create movie. Endpoint only available for admin users.' })
  @ApiCreatedResponse({ description: 'Returns the created movie.' })
  @ApiConflictResponse({ description: ERROR_MSG_MOVIES.DUPLICATED_MOVIE })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.movies.create(createMovieDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Returns a paginated list of all the movies in the database.' })
  async findAll(@Query('page') page: number = 0, @Query('size') size: number = 10) {
    size = size <= 1000 && size > 0 ? size : 1000;
    return await this.movies.findAll(page, size);
  }

  @Get('search')
  @ApiOkResponse({ description: 'Returns the movie that matches the title provided.' })
  async findOneByTitle(@Query('title') title: string) {
    const movie = await this.movies.findOneByTitle(title);
    
    if(!movie) {
      throw new NotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
    }

    return movie;
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Returns the movie that matches the uuid provided.' })
  async findOne(@Param('uuid') uuid: string) {
    const movie = await this.movies.findOne(uuid);

    if(!movie) {
      throw new NotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
    }

    return movie;
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete movie. Endpoint only available for admin users.' })
  @ApiOkResponse({ description: 'Movie deleted.' })
  @ApiNotFoundResponse({ description: ERROR_MSG_MOVIES.MOVIE_NOT_FOUND })
  async remove(@Param('uuid') uuid: string) {
    return await this.movies.remove(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update movie. Endpoint only available for admin users.' })
  @ApiOkResponse({ description: 'Returns the updated movie.' })
  @ApiNotFoundResponse({ description: ERROR_MSG_MOVIES.MOVIE_NOT_FOUND })
  async update(@Param('uuid') uuid: string, @Body() updateMovieDto: UpdateMovieDto) {
    return await this.movies.update(uuid, updateMovieDto);
  }

}
