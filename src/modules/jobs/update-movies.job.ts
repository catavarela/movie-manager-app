import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { MoviesService } from '../movies/movies.service';
import { CreateMovieDto, UpdateMovieDto } from '../movies/dto';
import { ConfigService } from '@nestjs/config';

interface SWMovie {
  characters: string[];
  created: Date;
  director: string;
  edited: Date;
  episode_id: string;
  opening_crawl: string;
  planets: string[];
  producer: string;
  release_date: Date;
  species: string[];
  starships: string[];
  title: string;
  url: string;
  vehicles: string[];
}

@Injectable()
export class UpdateMoviesJob {
  constructor(private readonly movies: MoviesService, private readonly config: ConfigService){}

  @Cron('0 3 * * *')
  async importStarWarsMovies() {
    console.log("Running update movies")
    
    let page = 1;
    let response;
    let movies: SWMovie[];
    const swurl = this.config.get("SWAPI_URL") ?? '';

    do{
      response = (await axios.get(swurl, { params: { page } }))?.data
      movies = response?.results
      page++;

      await this.createOrUpdateMovies(movies);

    } while(response && !!response.next)
  }

  private async createOrUpdateMovies(movies: SWMovie[]) {
    const {SWMoviesInDB, SWMoviesNotInDB} = await this.separateMoviesByPresenceInDB(movies);
    const moviesInDBReadyToSave = SWMoviesInDB.map(movie => this.transformToUpdateMovieDto(movie));
    const moviesNotInDBReadyToSave = SWMoviesNotInDB.map(movie => this.transformToCreateMovieDto(movie));

    return Promise.all([
      this.movies.updateMany(moviesInDBReadyToSave),
      this.movies.createMany(moviesNotInDBReadyToSave),
    ]);
  }

  private transformToUpdateMovieDto(movie: SWMovie & { id: string }): UpdateMovieDto {
    const { id, ...movieWithoutId } = movie;

    return {
      ...this.transformToCreateMovieDto(movieWithoutId),
      id,
    }
  }

  private transformToCreateMovieDto(movie: SWMovie): CreateMovieDto {
    return {
        title: movie.title,
        director: movie.director,
        producer: movie.producer,
        release_date: new Date(movie.release_date),
        url: movie.url,
        metadata: {
          characters: movie.characters,
          created: movie.created,
          edited: movie.edited,
          episode_id: movie.episode_id,
          opening_crawl: movie.opening_crawl,
          planets: movie.planets,
          species: movie.species,
          starships: movie.starships,
          vehicles: movie.vehicles,
        }
    }
  }

  private async separateMoviesByPresenceInDB(movies: SWMovie[]) {
    const movieTitles = movies.map(movie => movie.title);
    const moviesInDB = await this.movies.findManyByTitle(movieTitles);

    const titlesAndIdInDB = new Map(moviesInDB.map(movie => [ movie.title, movie.id ]));

    const SWMoviesInDB: (SWMovie & { id: string })[] = movies
      .filter(movie => titlesAndIdInDB.has(movie.title))
      .map(movie => ({...movie, id: titlesAndIdInDB.get(movie.title) as string}));

    const SWMoviesNotInDB: SWMovie[] = movies.filter(movie => !titlesAndIdInDB.has(movie.title));

    return { SWMoviesInDB, SWMoviesNotInDB}
  }
}