import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET,
  multipleStatements: false,
  timezone: process.env.DB_TIMEZONE,
};


const pool = mysql.createPool(dbConfig);

pool.promise()
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release(); 
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default pool.promise();
