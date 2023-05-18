FROM node:14.21.3-bullseye
LABEL maintainer="diego.suntaxi@outlook.es"

WORKDIR /app

COPY . .

EXPOSE 5000

RUN npm install



