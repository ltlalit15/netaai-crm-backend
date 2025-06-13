import express from "express";
import AuthController from "../Controllers/AuthCtrl.js";
import { authMiddleware } from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/login", AuthController.logins);

router.post("/register", AuthController.register);

router.post("/create-user", AuthController.userRegister);

export default router;
