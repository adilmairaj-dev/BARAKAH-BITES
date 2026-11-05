import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import Restaurant from "../models/restaurants.models.js";

const verifyRestaurants = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const restaurant = await Restaurant.findById(decoded?._id).select("-password -refreshToken");
    if (!restaurant) {
        throw new ApiError(401, "Unauthorized")
    }
    
    req.restaurant = restaurant
    next()
})

export { verifyRestaurants }