import mongoose from "mongoose";

const roomReviewSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    userImage: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomReview", roomReviewSchema);