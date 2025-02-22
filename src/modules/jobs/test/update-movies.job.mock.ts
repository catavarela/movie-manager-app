import { fa, faker } from "@faker-js/faker/.";

export const swMovieMockFactory = () => {
  return {
    title: faker.word.words({ count: { min: 1, max: 5 }}),
    director: [faker.person.firstName, faker.person.lastName()].join(' '),
    producer: [faker.person.firstName, faker.person.lastName()].join(' '),
    release_date: faker.date.anytime(),
    url: faker.internet.url(),
    characters: faker.helpers.multiple(() => faker.word.words()),
    created: faker.date.anytime(),
    edited: faker.date.anytime(),
    episode_id: faker.number.int(),
    opening_crawl: faker.lorem.paragraph(),
    planets: faker.helpers.multiple(() => faker.word.words()),
    species: faker.helpers.multiple(() => faker.word.words()),
    starships: faker.helpers.multiple(() => faker.word.words()),
    vehicles: faker.helpers.multiple(() => faker.word.words()),
  }
};