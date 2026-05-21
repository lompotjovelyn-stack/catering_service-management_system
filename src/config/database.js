const mysql = require("mysql2/promise");
const { URL } = require("url");

let pool;

function parseDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.CLEARDB_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = new URL(databaseUrl);
  const database = parsed.pathname?.replace(/^\//, "") || undefined;

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database,
  };
}

function getDbConfig() {
  const urlConfig = parseDatabaseUrl();
  if (urlConfig) {
    return urlConfig;
  }

  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER || process.env.RENDER_ENV);
  const hasDbEnv = Boolean(process.env.DB_HOST || process.env.DB_USER || process.env.DB_PASSWORD || process.env.DB_NAME);

  if (!hasDbEnv && isProduction) {
    throw new Error(
      "Missing database configuration in production. Set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Render environment variables."
    );
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "catering_service_db",
  };
}

async function connectDatabase() {
  const config = getDbConfig();
  if (!config.database) {
    throw new Error("Missing database name. Set DB_NAME or use DATABASE_URL with a database path.");
  }

  const shouldCreateDatabase = process.env.DB_CREATE
    ? process.env.DB_CREATE !== "false"
    : !process.env.DATABASE_URL && !process.env.MYSQL_URL && !process.env.CLEARDB_DATABASE_URL;

  if (shouldCreateDatabase) {
    const setup = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    await setup.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await setup.end();
  }

  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

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
  connectDatabase,
  getPool,
  query,
};
