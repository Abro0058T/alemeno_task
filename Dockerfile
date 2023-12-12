FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update -y
RUN apt-get install -y nodejs 
COPY Controllers Controllers
COPY Routes Routes
COPY utilis utilis
COPY .env .env
COPY package-lock.json package-lock.json

COPY package.json package.json

COPY server.js server.js

RUN npm install --force


CMD ["node", "server.js"]

EXPOSE 4000