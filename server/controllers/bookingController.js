import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import { clerkClient } from "@clerk/express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Coupon from "../models/Coupon.js";
import PDFDocument from "pdfkit";


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
    const { room, checkInDate, checkOutDate, guests, couponCode } = req.body;
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

    // Re-validate the coupon server-side — never trust a discount amount
    // sent from the client, always recompute it here.
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        hotel: roomData.hotel._id,
      });

      if (
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date()
      ) {
        discountAmount = Math.round((totalPrice * coupon.discountPercent) / 100);
        totalPrice -= discountAmount;
        appliedCouponCode = coupon.code;
      }
    }

    await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      couponCode: appliedCouponCode,
      discountAmount,
    });

    let user;
    try {
      user = await clerkClient.users.getUser(userId);
    } catch {
      user = null;
    }

    if (user?.emailAddresses?.[0]?.emailAddress) {
      try {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user.emailAddresses[0].emailAddress,
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
      ${appliedCouponCode ? `<li><strong>Coupon Applied:</strong> ${appliedCouponCode} (-${process.env.CURRENCY || "₹"}${discountAmount})</li>` : ""}
      <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "₹"} ${totalPrice}</li>
    </ul>
    <p>We look forward to welcoming you!</p>
    <p>If you need to make any changes, feel free to contact us.</p>  
  `
        };

        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("Booking confirmation email failed:", mailError.message);
      }
    }

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

    // Booking.user stores the Clerk ID (a string), not the User model's
    // Mongo _id — so Mongoose `.populate("user")` can never match it.
    // We look the users up manually instead, and attach display info
    // to each booking before sending it to the frontend.
    const clerkIds = [...new Set(bookings.map((b) => b.user))];
    const users = await User.find({ clerkId: { $in: clerkIds } });
    const userMap = Object.fromEntries(users.map((u) => [u.clerkId, u]));

    const bookingsWithUser = bookings.map((b) => {
      const obj = b.toObject();
      const matchedUser = userMap[b.user];
      obj.userName = matchedUser?.username || matchedUser?.email || "Guest";
      return obj;
    });

    const activeBookings = bookings.filter((b) => b.status !== "cancelled");

    const totalBookings = activeBookings.length;

    const totalRevenue = activeBookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings: bookingsWithUser,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

//For payment — created lazily so a missing/empty Razorpay key doesn't crash the whole server on startup
let razorpay = null;
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env)");
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// CREATE ORDER
export const razorpayPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false });
    }

    const order = await getRazorpay().orders.create({
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
    res.json({ success: false, message: err.message });
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



export const cancelBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * GENERATE PDF INVOICE (only the booking's own user can download it)
 */
export const generateInvoice = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("room hotel");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to view this invoice" });
    }

    const currency = process.env.CURRENCY || "Rs.";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text("WanderLust", { align: "left" });
    doc.fontSize(10).fillColor("#666").text("Booking Invoice", { align: "left" });
    doc.moveDown(2);

    doc.fillColor("#000").fontSize(12);
    doc.text(`Invoice for Booking #${booking._id}`);
    doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Stay Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Hotel: ${booking.hotel?.name || "N/A"}`);
    doc.text(`Address: ${booking.hotel?.address || "N/A"}`);
    doc.text(`Room Type: ${booking.room?.roomType || "N/A"}`);
    doc.text(`Check-In: ${new Date(booking.checkInDate).toDateString()}`);
    doc.text(`Check-Out: ${new Date(booking.checkOutDate).toDateString()}`);
    doc.text(`Guests: ${booking.guests}`);
    doc.moveDown();

    doc.fontSize(14).text("Payment Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);

    if (booking.couponCode) {
      doc.text(`Coupon Applied: ${booking.couponCode}`);
      doc.text(`Discount: -${currency}${booking.discountAmount}`);
    }

    doc.text(`Payment Method: ${booking.paymentMethod}`);
    doc.text(`Payment Status: ${booking.isPaid ? "Paid" : "Pending"}`);
    doc.moveDown(0.5);
    doc.fontSize(13).text(`Total Amount: ${currency}${booking.totalPrice}`, { underline: true });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#888").text(
      "Thank you for booking with WanderLust.",
      { align: "center" }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};