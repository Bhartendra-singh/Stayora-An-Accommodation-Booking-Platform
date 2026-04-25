import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  createRoom,
  getRooms,
  getOwnerRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// GET all rooms
roomRouter.get("/", getRooms);

// GET owner rooms
roomRouter.get("/owner", getOwnerRooms);

// CREATE room
roomRouter.post(
  "/",
  upload.array("images", 4),
  createRoom
);

// TOGGLE availability
roomRouter.post("/toggle-availability/:id", toggleRoomAvailability);

export default roomRouter;