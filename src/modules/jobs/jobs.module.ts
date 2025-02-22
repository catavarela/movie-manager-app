import { Module } from '@nestjs/common';
import { UpdateMoviesJob } from './update-movies.job';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [UpdateMoviesJob]
})
export class JobsModule {}
