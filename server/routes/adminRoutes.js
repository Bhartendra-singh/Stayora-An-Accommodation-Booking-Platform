import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { writeLimiter } from "../middleware/rateLimiters.js";
import {
  getStats,
  getAllHotels,
  getAllUsers,
  getAllBookings,
  updateUserRole,
  deleteHotel,
  adminCancelBooking,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/stats", protect, requireAdmin, getStats);
adminRouter.get("/hotels", protect, requireAdmin, getAllHotels);
adminRouter.get("/users", protect, requireAdmin, getAllUsers);
adminRouter.get("/bookings", protect, requireAdmin, getAllBookings);

adminRouter.patch("/users/:id/role", protect, requireAdmin, writeLimiter, updateUserRole);
adminRouter.delete("/hotels/:id", protect, requireAdmin, writeLimiter, deleteHotel);
adminRouter.patch("/bookings/:id/cancel", protect, requireAdmin, writeLimiter, adminCancelBooking);

export default adminRouter;