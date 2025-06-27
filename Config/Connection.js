//live db
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "netaaicrm",
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

//live db
// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// const dbConfig = {
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "",
//   database: "crm",
//   charset: "utf8mb4",
//   multipleStatements: false,
//   timezone: "Z",
// };


// const pool = mysql.createPool(dbConfig);

// pool.promise()
//   .getConnection()
//   .then((connection) => {
//     console.log("Database connected successfully");
//     connection.release(); 
//   })
//   .catch((err) => {
//     console.error("Error connecting to the database:", err);
//   });

// export default pool.promise();

