//live db
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: "shinkansen.proxy.rlwy.net",
  port: 36724,
  user: "root",
  password: "knXfjVtnqprCIfozUaLymhPfJuNSfwoR",
  database: "railway",
  charset: "utf8mb4",
  multipleStatements: false,
  timezone: "Z",
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

