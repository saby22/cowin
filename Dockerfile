FROM node:14.16.1-alpine

WORKDIR /app

COPY . /app

RUN npm install

ENTRYPOINT ["node","app.js"]