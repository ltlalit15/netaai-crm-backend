//live db
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: "trolley.proxy.rlwy.net",        // ✅ Updated Host
  port: 12653,                            // ✅ Updated Port
  user: "root",                           // ✅ Updated User
  password: "hGRAtSzjpWhYFefQymlhiFUphnrSAumj",  // ✅ Updated Password
  database: "railway",                   // ✅ Updated Database
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

