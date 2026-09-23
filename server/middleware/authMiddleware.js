import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

const protect = async (req, res, next) => {
  try {

    const auth = req.auth();
    const userId = auth.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    //  Check user in DB
    let user = await User.findOne({ clerkId: userId });

    //  CREATE USER IF NOT EXISTS
    if (!user) {
      //  Get user from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        image: clerkUser.imageUrl || "",
        role: "user",
        recentSearchCities: [],
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default protect;