import Room from "../models/Room.js";

// GET USER DATA
export const getUserData = async (req, res) => {
  try {

    const { role, recentSearchCities, savedRooms } = req.user;

    res.json({
      success: true,
      role,
      recentSearchCities,
      savedRooms,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// STORE RECENT SEARCH CITIES
export const storeRecentSearchCities = async (req, res) => {
  try {

    const { city } = req.body;
    const user = req.user;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required"
      });
    }

    user.recentSearchCities = user.recentSearchCities || [];

    // Remove duplicate city
    user.recentSearchCities = user.recentSearchCities.filter(
      (c) => c !== city
    );

    // Keep only last 3 cities
    if (user.recentSearchCities.length >= 3) {
      user.recentSearchCities.shift();
    }

    user.recentSearchCities.push(city);

    await user.save();

    res.json({
      success: true,
      message: "City added",
      recentSearchCities: user.recentSearchCities
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// TOGGLE A ROOM IN THE WISHLIST (add if not saved, remove if already saved)
export const toggleWishlist = async (req, res) => {
  try {

    const { roomId } = req.params;
    const user = req.user;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room id is required"
      });
    }

    user.savedRooms = user.savedRooms || [];

    const alreadySaved = user.savedRooms.includes(roomId);

    if (alreadySaved) {
      user.savedRooms = user.savedRooms.filter((id) => id !== roomId);
    } else {
      user.savedRooms.push(roomId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !alreadySaved,
      savedRooms: user.savedRooms
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET FULL WISHLIST (rooms + hotel info, for the "My Wishlist" page)
export const getWishlist = async (req, res) => {
  try {

    const user = req.user;
    const savedRooms = user.savedRooms || [];

    const rooms = await Room.find({ _id: { $in: savedRooms } }).populate("hotel");

    res.json({
      success: true,
      rooms
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};