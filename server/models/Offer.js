import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  priceOff: Number,
  expiryDate: String,

    room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});



const Offer = mongoose.model("Offer", offerSchema);
export default Offer;