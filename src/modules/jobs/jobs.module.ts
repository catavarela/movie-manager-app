import { Module } from '@nestjs/common';
import { UpdateMoviesService } from './update-movies.job.service';
import { MoviesService } from '../movies/movies.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [UpdateMoviesService]
})
export class JobsModule {}
