import express from "express";
import { getTestimonials, addTestimonial } from "../controllers/testimonialController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", requireAuth(), addTestimonial);

export default router;