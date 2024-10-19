import express from "express";
import userRouter from "../modules/user/userRoutes.js";
import productRouter from "../modules/product/productRoute.js";
import cartRouter from "../modules/cart/cartRouter.js";
import orderRouter from "../modules/order/orderRouter.js";
import taskTwoRouter from "../modules/taskTwo/route.js";

const router = express.Router();

router.use("/api/user", userRouter);
router.use("/api/product", productRouter);
router.use("/api/cart", cartRouter);
router.use("/api/order", orderRouter);
router.use("/api", taskTwoRouter);
export default router;
