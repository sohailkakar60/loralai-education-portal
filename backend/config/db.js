const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();


// =========================================================
// REQUIRED ENVIRONMENT VARIABLES
// =========================================================

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

for (const variable of requiredEnv) {
  if (
    process.env[variable] === undefined ||
    process.env[variable] === ""
  ) {
    console.error(
      `Missing required environment variable: ${variable}`
    );

    process.exit(1);
  }
}


// =========================================================
// SSL CONFIG
// =========================================================

let sslConfig = undefined;

if (process.env.DB_SSL === "true") {
  const ca = process.env.DB_SSL_CA;

  if (!ca) {
    console.error(
      "DB_SSL=true but DB_SSL_CA is missing."
    );

    process.exit(1);
  }

  sslConfig = {
    ca,
    rejectUnauthorized: true,
  };

  console.log(
    "MySQL SSL configuration enabled."
  );
}


// =========================================================
// MYSQL CONNECTION POOL
// =========================================================

const pool = mysql.createPool({
  host: process.env.DB_HOST,

  port: Number(
    process.env.DB_PORT || 3306
  ),

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: Number(
    process.env.DB_CONNECTION_LIMIT || 10
  ),

  queueLimit: 0,

  ssl: sslConfig,
});


// =========================================================
// TEST DATABASE CONNECTION
// =========================================================

const testDatabaseConnection =
  async () => {

    let connection;

    try {
      connection =
        await pool.getConnection();

      console.log(
        "MySQL database connected successfully."
      );

    } catch (error) {

      console.error(
        "MySQL connection failed:",
        error.message
      );

    } finally {

      if (connection) {
        connection.release();
      }

    }
  };


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  pool,
  testDatabaseConnection,
};