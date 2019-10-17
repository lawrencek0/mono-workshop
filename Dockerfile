FROM node:12-alpine as base

WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

FROM node:12-alpine as prod

WORKDIR  /usr/app
COPY package*.json ./
RUN npm ci

COPY --from=base /usr/app/dist ./dist

COPY .env ./

EXPOSE 8000
CMD node dist/server.js