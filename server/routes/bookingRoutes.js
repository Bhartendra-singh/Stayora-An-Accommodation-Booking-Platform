import express from "express";

import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
  // stripePayment,
  razorpayPayment,
  verifyRazorpay
} from "../controllers/bookingController.js";


const bookingRouter = express.Router();

// Check availability
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Create booking
bookingRouter.post("/book", createBooking);

// User bookings
bookingRouter.get("/user", getUserBookings);

// Hotel dashboard
bookingRouter.get("/hotel", getHotelBookings);
//For payment
// bookingRouter.post('/stripe-payment', stripePayment); 
bookingRouter.post("/razorpay-payment", razorpayPayment);
bookingRouter.post("/verify-payment", verifyRazorpay);

export default bookingRouter;