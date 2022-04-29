# Udacity: Build A Storefront Backend

## Overview
This is a backend API build in Nodejs for an online store. It exposes a RESTful API that will be used by the frontend developer on the frontend.

The database schema and and API route information can be found in the [REQUIREMENT.md]

## Installation Instructions
Here, I will list all the dependencies used in this project and how to install them.

1. TypeScript
`npm i -D typescript ts-node @types/node`

2. express and type express(Typescript support for express)
`npm i express` `npm i -D @types/express`

3. nodemon
`npm i -D nodemon`

4. eslint
`npm i -D eslint`

5. prettier
`npm i -D prettier`

6. set up prettier and eslint
`npm install -D eslint-config-prettier eslint-plugin-prettier`

7. TypeScript with eslint plugin
`npm i -D @typescript-eslint/eslint-plugin`

8. jasmine with type definition and jasmine spec reporter
`npm i -D jasmine @types/jasmine jasmine-spec-reporter`

9. SuperTest with type definition 
`npm i -D supertest @types/supertest`

10. bcrypt
`npm -i bcrypt` `npm -i -D @types/bcrypt`

11. dotenv
`npm i dotenv`

12. db-migrate
`npm i -D db-migrate db-migrate-pg`

13. pg
`npm i -D pg @types/pg`

14. jsonwebtoken
`npm i jsonwebtoken`

15. cors
`npm i cors` `npm i -D @types/cors`

## Set up Database
#### Create Databases
We will create the development and test database.
- connect to the default postgres database as the server's root user [psql -U postgres]
- In psql run the following to create a user
    - `CREATE USER admin WITH PASSWORD 'password123';`
- In psql run the following to create the development and test database
    - `CREATE DATABASE store_front;`
    - `CREATE DATABASE store_front_test;`
- Connect to the databases and grant all privileges
    - Grant for dev database
        - `\c store_front;`
        - `GRANT ALL PRIVILEGES ON DATABASE store_front TO admin;`
    - Grant for test database
        - `\c store_front_test;`
        - `GRANT ALL PRIVILEGES ON DATABASE store_front_test TO admin;`

#### Migrate Database
Navigate to the root directory and run the command below to migrate the database
`npm run db:up`

## Set Up Environment Variables
Bellow are the environmental variables that needs to be set in a [.env] file. This is the default setting that I used for development, but you can change it to what works for you.

Note: The given values are used in development and testing but not in production.

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=store_front
POSTGRES_DB_TEST=store_front_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=my-new-password
SALT_ROUND=10
TOKEN_SECRET=my-token-secret
NODE_ENV=development
```

## Start App
`npm run start`

## Running Ports
After start up, the server will start on port [3000] and the database on port [5432]

## Endpoint Access
All endpoints are described in the [REQUIREMENT.md] file.

## Token and Authentication
Tokens are passed along with the http header as
[Authorization   Bearer <token>]

## Testing
Run test with
`npm run test`

It sets the environment to [test], migrates up tables for the test database, run the test then migrate down all the tables for the test database.

## Important Notes
#### Environment Variables
Environment variables are set in the [.env] file and added in [.gitignore] so that it won't be added to github. However, I had provided the names of the variables that need to be set above. I also provided the values that were used in development and testing.

#### Changing Environment to testing
I had set up two databases, one for development and the other for testing. During testing, I had to make sure the testing database is used instead of the development database.

To achieve this, I set up a variable in the [.env] file which is by default set to [development]. During testing, the command `npm run test` will set this variable to testing in the package.json. Here is the complete command. `NODE_ENV=test db-migrate --env test up && jasmine && db-migrate db:drop test`

The first command migrates all tables then the second command changes the environment variable [NODE_ENV] to testing, then the jasmine is run and then after testing, the database is reset.