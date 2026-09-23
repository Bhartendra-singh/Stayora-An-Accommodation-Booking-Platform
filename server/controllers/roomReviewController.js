import RoomReview from "../models/RoomReview.js";
import { clerkClient } from "@clerk/express";

export const getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reviews = await RoomReview.find({ room: roomId }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      success: true,
      reviews,
      avgRating,
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRoomReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { room, rating, comment } = req.body;

    if (!room || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Room, rating and comment are all required",
      });
    }

    const existing = await RoomReview.findOne({ room, userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You've already reviewed this room",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    const review = await RoomReview.create({
      room,
      userId,
      userName: user.firstName || user.username || "Guest",
      userImage: user.imageUrl || "",
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};