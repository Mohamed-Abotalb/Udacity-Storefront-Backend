import config from '../config';
import { Pool } from 'pg';

const client = new Pool({
    host: config.host,
    database: config.database,
    port: config.dbPort,
    user: config.user,
    password: config.password
});

export default client;