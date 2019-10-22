FROM node:12-alpine as base

WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:12-alpine as prod

WORKDIR  /usr/app
COPY package*.json ./
RUN npm ci

COPY --from=base /usr/app/dist ./dist

COPY .env ./

EXPOSE 8000
CMD node dist/server.js