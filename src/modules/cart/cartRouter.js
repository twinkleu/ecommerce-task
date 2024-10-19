import express from "express";
import { addProductToCart } from "./cartController.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/addProduct", checkAuth.User, addProductToCart);

export default router;
