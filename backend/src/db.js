import pg from "pg";
import { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } from "./config.js";

const pool = new pg.Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
});

export default pool;
