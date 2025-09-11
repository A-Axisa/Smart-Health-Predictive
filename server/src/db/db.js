import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// db connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3307,
  user: process.env.MYSQL_USER || 'admin',
  password: process.env.MYSQL_PASSWORD || 'admin',
  database: process.env.MYSQL_DATABASE || 'user-db',
});

export default pool;