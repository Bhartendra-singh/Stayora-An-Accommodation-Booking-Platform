import express from "express";
import protect from "../middleware/authMiddleware.js";
import { writeLimiter } from "../middleware/rateLimiters.js";
import { getRoomReviews, addRoomReview } from "../controllers/roomReviewController.js";

const roomReviewRouter = express.Router();

roomReviewRouter.get("/:roomId", getRoomReviews);
roomReviewRouter.post("/", protect, writeLimiter, addRoomReview);

export default roomReviewRouter;