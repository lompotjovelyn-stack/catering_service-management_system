const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "catering_service_db";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

async function connectDatabase() {
  const setup = await mysql.createConnection(dbConfig);
  await setup.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await setup.end();

  pool = mysql.createPool({ ...dbConfig, database: DB_NAME });
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool is not ready.");
  }
  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

module.exports = {
  DB_NAME,
  connectDatabase,
  getPool,
  query,
};
