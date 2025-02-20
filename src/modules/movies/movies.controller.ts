import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../users/roles/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../users/roles/guards/roles.guard';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.movies.create(createMovieDto);
  }

  @Get()
  async findAll(@Query('page') page: number = 0, @Query('size') size: number = 10) {
    size = size <= 1000 && size > 0 ? size : 1000;
    return await this.movies.findAll(page, size);
  }

  @Get('search')
  async findOneByTitle(@Query('title') title: string) {
    const movie = await this.movies.findOneByTitle(title);
    
    if(!movie) {
      throw new NotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
    }

    return movie;
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    const movie = await this.movies.findOne(uuid);

    if(!movie) {
      throw new NotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
    }

    return movie;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':uuid')
  @Roles(Role.ADMIN)
  async remove(@Param('uuid') uuid: string) {
    return await this.movies.remove(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  async update(@Param('uuid') uuid: string, @Body() updateMovieDto: UpdateMovieDto) {
    return await this.movies.update(uuid, updateMovieDto);
  }

}
