
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

## Generate a module
Run `npm run module` `module name` to generate a module.
A module comprise of the following file(s): 
- **module_name.controller.ts**
- **module_name.data.ts**
- **module_name.service.ts**
- **module_name.validators.ts**

## Generate a model
Run `npm run model` `model name` to generate a model.
A model comprise of the following file(s): 
- **model_name.model.ts**

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