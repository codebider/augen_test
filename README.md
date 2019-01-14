# Augen Coding Challenge

## Installing
1. You should have `PostgreSQL` installed on your machine
2. Edit database config for `development` environment on `config/config.js`
3. Install dependencies: `yarn install`
4. Run database migrations: `NODE_ENV=development node_modules/.bin/sequelize db:migrate`
4. Run seed data: `NODE_ENV=development node_modules/.bin/sequelize db:seed:all`
5. Running server: `yarn start`

## Testing
1. For testing, we will create another database for storing test data
2. Remember to edit database config for `test` environment
3. Run database migrations: `NODE_ENV=test node_modules/.bin/sequelize db:migrate`
4. Run test: `yarn test`

## Requirements

Your goal is to create a one-page web application that will list customers and have it searchable.
Customer data will be held in a CSV file which will need to be extracted by an API using .Net core.
You can chose to use HTML5 and/or a javascript framework of your choice for the front end and call the API to
obtain customer data and have it presented in a user friendly manner.

## TODO
- Extracted data from csv to database
- Build frontend web