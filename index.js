import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import path, { dirname } from "path";
import fileUpload from "express-fileupload";
import session from "express-session";
import { fileURLToPath } from "url";
import fs from 'fs';
dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import routes from "./app.js";

const app = express();
const server = http.createServer(app);


// ✅ Safe temp dir path for file uploads
const tempDir = path.join(__dirname, 'tmp');

// ✅ Ensure 'tmp' folder exists or create it
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

// ✅ File Upload Middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  limits: {
    fileSize: 100 * 1024 * 1024 // ✅ Increased to 100MB for video safety
  },
  preserveExtension: true,
  safeFileNames: true,
  abortOnLimit: true,

  limitHandler: function (req, res, next) {
    return res.status(400).json({
      success: false,
      message: 'File size limit exceeded (max 100MB)',
      error: null
    });
  }
}));


// ✅ CORS Configuration
const corsOptions = {
  origin: ['https://crm.bonbonteamapp.com'], // ✅ Allowed frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true // ✅ Allow cookies/sessions
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/", routes);

// Start the server
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
