import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
dotenv.config();

import routes from "./app.js";

const app = express();
const server = http.createServer(app);

// Configuration
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/", routes);


// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
