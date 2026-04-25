import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * CREATE ROOM
 */
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const { userId } = req.auth();

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    // Cloudinary Upload
    const images = await Promise.all(
      req.files.map(async (file) => {
        const uploadRes = await cloudinary.uploader.upload(file.path);
        return uploadRes.secure_url;
      })
    );

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities:
        typeof amenities === "string" ? JSON.parse(amenities) : amenities,
      images,
    });

    res.json({
      success: true,
      message: "Room created successfully",
    });

  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL AVAILABLE ROOMS
 */
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate("hotel") // FIXED (removed wrong nested populate)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms,
    });

  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ROOMS OF LOGGED-IN OWNER
 */
export const getOwnerRooms = async (req, res) => {
  try {
    const { userId } = req.auth();

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const rooms = await Room.find({ hotel: hotel._id }).populate("hotel");

    res.json({
      success: true,
      rooms,
    });

  } catch (error) {
    console.error("Get owner rooms error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * TOGGLE ROOM AVAILABILITY
 */
export const toggleRoomAvailability = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { userId } = req.auth();

    const room = await Room.findById(roomId).populate("hotel");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    //  FIXED (safe compare)
    if (room.hotel.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({
      success: true,
      message: "Room availability updated",
    });

  } catch (error) {
    console.error("Toggle room error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};