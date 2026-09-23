import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { writeLimiter } from "../middleware/rateLimiters.js";
import {
  getOffers,
  createOffer,
  deleteOffer,
} from "../controllers/offerController.js";

const router = express.Router();

// Only hotel owners can create/delete offers
const requireHotelOwner = (req, res, next) => {
  if (req.user?.role !== "hotelOwner") {
    return res.status(403).json({
      success: false,
      message: "Only hotel owners can manage offers",
    });
  }
  next();
};

router.get("/", getOffers); // public — anyone can view offers
router.post("/", protect, writeLimiter, requireHotelOwner, upload.single("image"), createOffer);
router.delete("/:id", protect, writeLimiter, requireHotelOwner, deleteOffer);

export default router;