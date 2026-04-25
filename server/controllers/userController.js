// GET USER DATA
export const getUserData = async (req, res) => {
  try {

    const { role, recentSearchCities } = req.user;

    res.json({
      success: true,
      role,
      recentSearchCities
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