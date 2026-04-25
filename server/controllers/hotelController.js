import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const { userId } = req.auth();

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingHotel = await Hotel.findOne({ owner: userId });
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel already registered",
      });
    }

    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner: userId,
    });

    //  FIXED (Clerk ID)
    await User.findOneAndUpdate(
      { clerkId: userId },
      { role: "hotelOwner" }
    );

    res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};