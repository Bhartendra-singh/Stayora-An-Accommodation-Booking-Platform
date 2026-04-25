import express from "express";
import multer from "multer";
import {
  getOffers,
  createOffer,
  deleteOffer, // ADD THIS
} from "../controllers/offerController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getOffers);
router.post("/", upload.single("image"), createOffer);

//  DELETE ROUTE ADD KAR
router.delete("/:id", deleteOffer);

export default router;