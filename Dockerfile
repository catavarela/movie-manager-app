# Build local

FROM node:22 as dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY prisma ./prisma/

RUN npm ci

RUN chown -R node.node /usr/src/app

COPY --chown=node:node . .

EXPOSE 3000
ENV PORT=3000

USER node

CMD ["npm", "run", "start:dev"]