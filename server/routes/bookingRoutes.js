import express from "express";
import protect from "../middleware/authMiddleware.js";
import { writeLimiter } from "../middleware/rateLimiters.js";

import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  cancelBooking,
  getHotelBookings,
  generateInvoice,
  // stripePayment,
  razorpayPayment,
  verifyRazorpay
} from "../controllers/bookingController.js";


const bookingRouter = express.Router();

// Check availability (public — just checking dates, no sensitive data)
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Create booking (must be logged in)
bookingRouter.post("/book", protect, writeLimiter, createBooking);

// User bookings (must be logged in)
bookingRouter.get("/user", protect, getUserBookings);

// Cancel a booking (must be logged in — ownership checked in controller)
bookingRouter.patch("/cancel/:id", protect, writeLimiter, cancelBooking);

// Download PDF invoice (must be logged in — ownership checked in controller)
bookingRouter.get("/invoice/:id", protect, generateInvoice);

// Hotel dashboard (must be logged in — hotel owner)
bookingRouter.get("/hotel", protect, getHotelBookings);

// Payment (must be logged in)
// bookingRouter.post('/stripe-payment', stripePayment); 
bookingRouter.post("/razorpay-payment", protect, writeLimiter, razorpayPayment);
bookingRouter.post("/verify-payment", protect, writeLimiter, verifyRazorpay);

export default bookingRouter;