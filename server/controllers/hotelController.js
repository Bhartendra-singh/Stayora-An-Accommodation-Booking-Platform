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

/**
 * GET MY HOTEL (for the logged-in hotel owner)
 */
export const getMyHotel = async (req, res) => {
  try {
    const { userId } = req.auth();

    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this account",
      });
    }

    res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE MY HOTEL
 */
export const updateMyHotel = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hotel = await Hotel.findOneAndUpdate(
      { owner: userId },
      { name, address, contact, city },
      { returnDocument: 'after' }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this account",
      });
    }

    res.json({
      success: true,
      message: "Hotel details updated successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};