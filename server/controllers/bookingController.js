import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../config/nodemailer.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Razorpay from "razorpay";
import crypto from "crypto";


/**
 * CHECK ROOM AVAILABILITY (internal function)
 */
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  const bookings = await Booking.find({
    room,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
  });

  return bookings.length === 0;
};

/**
 * API: CHECK AVAILABILITY
 * POST /api/bookings/check-availability
 */
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * CREATE BOOKING
 */
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const { userId } = req.auth();

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available",
      });
    }

    const roomData = await Room.findById(room).populate("hotel");

    let totalPrice = roomData.pricePerNight;

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) /
        (1000 * 3600 * 24)
    );

    totalPrice *= nights;

    await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

let user;
try {
  user = await clerkClient.users.getUser(userId);
} catch {
  user = null;
}

const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: user.emailAddresses?.[0]?.emailAddress, 
  subject: 'Hotel Booking Details',
  html: `
    <h2>Your Booking Details</h2>
    <p>Dear ${user.firstName || "User"},</p>
    <p>Thank you for your booking! Here are your details:</p>
    <ul>
      <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
      <li><strong>Location:</strong> ${roomData.hotel.address}</li>
      <li><strong>Check-In Date:</strong> ${new Date(checkInDate).toDateString()}</li>
      <li><strong>Check-Out Date:</strong> ${new Date(checkOutDate).toDateString()}</li>
      <li><strong>Guests:</strong> ${guests}</li>
      <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "₹"} ${totalPrice}</li>
    </ul>
    <p>We look forward to welcoming you!</p>
    <p>If you need to make any changes, feel free to contact us.</p>  
  `
}

    await transporter.sendMail(mailOptions)

    res.json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

/**
 * GET USER BOOKINGS
 */
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    const bookings = await Booking.find({ user: userId })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/**
 * GET HOTEL BOOKINGS (Dashboard)
 */
export const getHotelBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel found",
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

//For payment
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
export const razorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false });
    }

    const order = await razorpay.orders.create({
      amount: booking.totalPrice * 100,
      currency: "INR",
      receipt: bookingId.toString(),
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
};

// VERIFY PAYMENT
export const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected === razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Razorpay",
        status: "confirmed",
      });

      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (err) {
    res.json({ success: false });
  }
};