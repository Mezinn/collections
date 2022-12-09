How to run application locally?

Requirements

- You must have docker-compose installed

Sequence of actions

- go to project root
- `cd ./docker`
- `cp .env.example .env`
- `docker-compose up -d`
- `docker-compose exec node cp .env.example .env`
- `docker-compose npm i`
- `docker-compose exec node npm run start:dev`
