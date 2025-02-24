# Movie Manager App

With this project you can browse through a catalog of movies. Admins can also create, update and delete movies.

On top of this, there is a cron set up to sync the Star Wars movies from the Stars Wars API into the manager's database.

## Build and run the project locally

Make sure you have a valid .env and run:

```bash
$ docker-compose up --build
```

Once built, unless you make changes that can affect the container configuration like installing new dependencies or creating new db migrations, you can run the project with:

```bash
$ docker-compose up
```

## App Documentation

For the Swagger documentation available, please visit http://localhost:3000/api/.

## Create admin users

There are certain actions restricted to admin users like create, update or delete a movie. The only user that can promote users to an admin role is the root user.

### Promote admin users in local db

To promote admin users in your local db:

1. Create a user
2. Run

```bash
$ npx prisma studio
```

3. Open the Prisma db manager at http://localhost:5555/
4. Go to the Users table and find the user you created
5. Promote it to ROOT by changing the roles[] column manually
6. Use this user to promote other users through the promotion endpoint. See more in http://localhost:3000/api/

## Create and apply migrations

This project uses Prisma as it's ORM. To create a migration just run:

```bash
$ npx prisma migrate dev
```

To see it reflected on your container, rebuild the project.

## Run tests

This project has unit testing. To run the tests simply do:

```bash
# unit tests
$ npm run test
```
