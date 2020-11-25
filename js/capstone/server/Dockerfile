FROM node:12-alpine as base

WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn run build

FROM node:12-alpine as prod

WORKDIR  /usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY --from=base /usr/app/dist ./dist

COPY .env ./
COPY email-templates ./

RUN yarn global add pm2

EXPOSE 8000

CMD ["pm2-runtime", "dist/server.js"]