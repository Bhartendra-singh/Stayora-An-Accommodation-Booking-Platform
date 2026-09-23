import Coupon from "../models/Coupon.js";
import Hotel from "../models/Hotel.js";

export const createCoupon = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { code, discountPercent, expiryDate } = req.body;

    if (!code || !discountPercent || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Code, discount percent and expiry date are all required",
      });
    }

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this account",
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists",
      });
    }

    const coupon = await Coupon.create({
      code,
      discountPercent,
      expiryDate,
      hotel: hotel._id,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCoupons = async (req, res) => {
  try {
    const { userId } = req.auth();

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this account",
      });
    }

    const coupons = await Coupon.find({ hotel: hotel._id }).sort({ createdAt: -1 });

    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "No hotel found for this account" });
    }

    const coupon = await Coupon.findOne({ _id: id, hotel: hotel._id });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    await coupon.deleteOne();

    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, hotelId } = req.body;

    if (!code || !hotelId) {
      return res.status(400).json({ success: false, message: "Code and hotel are required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      hotel: hotelId,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "This coupon is no longer active" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    res.json({
      success: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};