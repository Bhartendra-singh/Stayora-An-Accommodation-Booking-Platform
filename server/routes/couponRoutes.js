import express from "express";
import protect from "../middleware/authMiddleware.js";
import { writeLimiter } from "../middleware/rateLimiters.js";
import {
  createCoupon,
  getMyCoupons,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/", protect, writeLimiter, createCoupon);
couponRouter.get("/mine", protect, getMyCoupons);
couponRouter.delete("/:id", protect, writeLimiter, deleteCoupon);
couponRouter.post("/validate", protect, validateCoupon);

export default couponRouter;