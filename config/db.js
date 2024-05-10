import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;


const { DB_PASSWORD, DB_USER, DB_DATABASE, DB_HOST, DB_PORT } = process.env


const config = {
host: DB_HOST,
database: DB_DATABASE,
user: DB_USER,
password: DB_PASSWORD,
port: DB_PORT,
allowExitOnIdle: true
}


const pool = new Pool(config);


export default pool;
