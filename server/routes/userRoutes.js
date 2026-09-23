import express from "express"
import protect  from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchCities, toggleWishlist, getWishlist } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.get('/',protect,getUserData);
userRouter.post('/store-recent-search',protect,storeRecentSearchCities);
userRouter.post('/wishlist/:roomId',protect,toggleWishlist);
userRouter.get('/wishlist',protect,getWishlist);


export default userRouter;