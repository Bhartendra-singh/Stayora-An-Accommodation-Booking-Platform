import express from "express"
import protect from "../middleware/authMiddleware.js"
import { writeLimiter } from "../middleware/rateLimiters.js"
import { registerHotel, getMyHotel, updateMyHotel } from "../controllers/hotelController.js";

const hotelRouter=express.Router();

hotelRouter.post('/',protect,writeLimiter,registerHotel);
hotelRouter.get('/me',protect,getMyHotel);
hotelRouter.put('/me',protect,writeLimiter,updateMyHotel);

export default hotelRouter;