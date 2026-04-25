import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    rating: { type: Number, default: 5 },
    review: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);