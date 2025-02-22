import { Movie } from "@prisma/client";
import { CreateMovieDto, UpdateMovieDto } from "../dto";
import { faker } from "@faker-js/faker/.";

export const movieMockFactory = (): Movie => {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    title: 'Interestellar',
    url: 'interestellar.com',
    director: [faker.person.firstName, faker.person.lastName()].join(' '),
    producer: [faker.person.firstName, faker.person.lastName()].join(' '),
    release_date: faker.date.anytime(),
    metadata: null
  }
}

const movieMock = movieMockFactory();

export const createMovieDtoMock: CreateMovieDto = {
  title: movieMock.title,
  url: movieMock.url
};

export const updateMovieDtoMock: UpdateMovieDto = {
  id: movieMock.id,
  title: movieMock.title,
  url: movieMock.url,
  director: "updatedDirector"
};