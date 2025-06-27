import express from "express";
import AuthController from "../Controllers/AuthCtrl.js";
import { authMiddleware } from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/login", AuthController.logins);

router.post("/register", AuthController.register);

router.post("/createUser", AuthController.createUser);

router.get("/getAllUsers", AuthController.getAllUsers);

router.get("/getUserById/:id", AuthController.getUserById);

router.patch("/updateUser/:id", AuthController.updateUser);

router.delete("/deleteUser/:id", AuthController.deleteUser);

router.patch("/updatePassword", AuthController.updatePassword);


export default router;

