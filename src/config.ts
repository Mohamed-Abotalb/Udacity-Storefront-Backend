import dotenv from 'dotenv';

// set configuration to use the environment variables from .env file
dotenv.config();

const {
    PORT,
    NODE_ENV,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    BCRYPT_PASSWORD,
    SALT_ROUND,
    TOKEN_SECRET
} = process.env;

// export environment variables to be used from config file with different names
export default {
    port: PORT,
    host: POSTGRES_HOST,
    database: NODE_ENV === 'development' ? POSTGRES_DB : POSTGRES_DB_TEST,
    dbPort: parseInt(POSTGRES_PORT as string),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    pepper: BCRYPT_PASSWORD,
    salt: SALT_ROUND,
    tokenSecret: TOKEN_SECRET
}

