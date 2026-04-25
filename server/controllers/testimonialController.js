import Testimonial from "../models/Testimonial.js";
import { clerkClient } from "@clerk/express";

//  GET ALL
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      testimonials
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ADD
export const addTestimonial = async (req, res) => {
  try {

    const { userId } = req.auth();

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await clerkClient.users.getUser(userId);

    const name = user.fullName;
    const image = user.imageUrl;

    const { address, rating, review } = req.body;

    const newTestimonial = new Testimonial({
      name,
      image,
      address,
      rating,
      review
    });

    await newTestimonial.save();

    res.json({
      success: true,
      message: "Review added"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};