import Offer from "../models/Offer.js";

//  GET ALL OFFERS
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("room");

    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  CREATE OFFER (NO IMAGE)
export const createOffer = async (req, res) => {
  try {
    const { title, description, priceOff, expiryDate, room } = req.body;

    const newOffer = new Offer({
      title,
      description,
      priceOff,
      expiryDate,
      room,
    });

    await newOffer.save();

    res.json({
      success: true,
      message: "Offer created",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  DELETE OFFER (IMPORTANT)
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    await Offer.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Offer deleted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};