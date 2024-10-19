import express from "express";
import { checkout, getOrders, placeOrder } from "./orderController.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/add", checkAuth.User, placeOrder);
router.post("/checkout", checkAuth.User, checkout);
router.get("/get", checkAuth.User, getOrders);

export default router;
