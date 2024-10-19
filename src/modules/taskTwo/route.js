import express from "express";
import {
  getUserProductOrderSummary,
  getWeeklyOrdersAnalysis,
  getProductOrderCounts,
  getProductsBySales,
} from "./controller.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = express.Router();

router.get(
  "/order-summary/:userId/:productId",
  checkAuth.User,
  getUserProductOrderSummary
);

router.get("/weeklyOrderAnalysis", checkAuth.User, getWeeklyOrdersAnalysis);

router.get("/product-orderCount", checkAuth.User, getProductOrderCounts);

router.get("/product-sales", checkAuth.User, getProductsBySales);
export default router;
