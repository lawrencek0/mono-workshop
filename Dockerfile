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
COPY email-templates ./

RUN npm install pm2 -g

EXPOSE 8000

CMD ["pm2-runtime", "dist/server.js"]