import express from "express";
import { getTestimonials, addTestimonial } from "../controllers/testimonialController.js";
import { requireAuth } from "@clerk/express";
import { writeLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", requireAuth(), writeLimiter, addTestimonial);

export default router;