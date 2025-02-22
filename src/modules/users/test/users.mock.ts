import { faker } from "@faker-js/faker/.";
import { Role, User } from "@prisma/client";

export const userMockFactory = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    roles: faker.helpers.arrayElements(Object.values(Role)),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    hash: faker.string.hexadecimal({ length: 20 }),
  }
};