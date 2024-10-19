import express from "express";
import { signup, login, logout } from "./userController.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.delete("/logout", checkAuth.User, logout);

export default router;
