![Build](https://github.com/isahohieku/blog-backend/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/isahohieku/blog-backend/branch/dev/graph/badge.svg?token=CM05O0HSRT)](https://codecov.io/gh/isahohieku/blog-backend)

# This is a simple nodeJS backend app for a Blog

## Start Using application
Run `npm install` or `npm i` to install dependencies


## Create a .env file at the root folder with the following variable
`PORT`

`LOG_LEVEL` - This should be `info`

`NODE_ENV` - This should be `development` or what ever environment you want to work on.

`DB_NAME`

`DB_USER`

`DB_PASSWORD`

`DB_HOST`

`DB_PORT`

`JWT_SECRET`

## Start app in development mode
Run `npm run dev` to start application in ***development*** mode (**windows OS**).
Run `npm run dev:mac` to start application in ***development*** mode (**Mac OS**).

> The Mac OS ***command*** is to enable ***Debug*** log as expected.

## Build app for production
Run `npm run prod` to build app for production.

## Start Application in production environment
Run `npm start` to start the application.

## Run app test coverage
Run `npm run test` to run application test coverage.