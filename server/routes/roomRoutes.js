import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import { writeLimiter } from "../middleware/rateLimiters.js";

import {
  createRoom,
  getRooms,
  getOwnerRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// GET all rooms (public)
roomRouter.get("/", getRooms);

// GET owner rooms (must be logged in)
roomRouter.get("/owner", protect, getOwnerRooms);

// CREATE room (must be logged in) — rate-limit before the file upload
// middleware runs, so an abusive client is rejected before we spend
// time/storage processing their images.
roomRouter.post(
  "/",
  protect,
  writeLimiter,
  upload.array("images", 4),
  createRoom
);

// TOGGLE availability (must be logged in)
roomRouter.post("/toggle-availability/:id", protect, writeLimiter, toggleRoomAvailability);

export default roomRouter;