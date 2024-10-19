import express from "express";
import { addProduct } from "./productController.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add", checkAuth.User, addProduct);

export default router;
