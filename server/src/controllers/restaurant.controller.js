import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Restaurant from "../models/restaurants.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {options} from "../constants.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

const accessAndRefreshTokenGenrator = async (restaurantId) => {
    try {
        const restaurant = await Restaurant.findById(restaurantId)
        const accessToken = jwt.sign({
            _id : restaurant._id,
            email : restaurant.email,
            name : restaurant.name,
        },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
            }
        )
        const refreshToken = jwt.sign({
            _id : restaurant._id,
            email : restaurant.email,
        },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY
            }
        )

        restaurant.refreshToken = refreshToken
        await restaurant.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const loginRestaurant = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        throw new ApiError(401, "Invalid credentials");
    }
    const restaurant = await Restaurant.findOne({ email }).select('+password');
    let restaurantAccount = restaurant;
    if (restaurantAccount) {
        const isPasswordValid = await bcrypt.compare(password, restaurantAccount.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        restaurantAccount = await Restaurant.create({
            email,
            password: hashedPassword
        })
        if (!restaurantAccount) {
            throw new ApiError(500, "Restaurant creation failed");
        }
    }

    const { accessToken, refreshToken } = await accessAndRefreshTokenGenrator(restaurantAccount._id);

    const loggedInRestaurant = await Restaurant.findById(restaurantAccount._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { loggedInRestaurant, accessToken, refreshToken }, "Restaurant logged in successfully")
        )
})

const logoutRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.restaurant._id;
    if (!restaurantId) {
        throw new ApiError(401, "Unauthorized");
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }
    restaurant.refreshToken = null;
    await restaurant.save({ validateBeforeSave: false });

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, null, "Restaurant logged out successfully")
        )
});

const currentRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.restaurant._id;
    if (!restaurantId) {
        throw new ApiError(401, "Unauthorized");
    }
    const restaurant = await Restaurant.findById(restaurantId).select("-password -refreshToken");
    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, restaurant, "Current restaurant fetched successfully")
        )
})

const getRestaurantInfo = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne().select("-password -refreshToken");
    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    return res.status(200).json(
        new ApiResponse(200, restaurant, "Restaurant info fetched successfully")
    );
});

const addDetails = asyncHandler(async (req, res) => {
    const restaurantId = req.restaurant?._id;

    if (!restaurantId) {
        throw new ApiError(401, "Unauthorized");
    }

    const {
        name,
        address,
        phone,
        opening_Time,
        closing_Time,
        description
    } = req.body;

    if (!name || !address || !phone || !opening_Time || !closing_Time || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const restaurantExists = await Restaurant.findById(restaurantId);

    if (!restaurantExists) {
        throw new ApiError(404, "Restaurant not found");
    }

    let newImage = null;

    if (req.file) {
        newImage = await uploadToImageKit(
            req.file.buffer,
            req.file.originalname,
            `/restaurants/${restaurantId}`
        );

        if (!newImage?.url || !newImage?.fileId) {
            throw new ApiError(500, "Image upload failed");
        }
    }

    const updateData = {
        name,
        address,
        phone,
        opening_Time,
        closing_Time,
        description
    };

    if (newImage) {
        updateData.image = newImage.url;
        updateData.fileId = newImage.fileId;
    }

    let restaurant;

    try {
        restaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).select("-password -refreshToken");

        if (!restaurant) {
            throw new ApiError(500, "Failed to update restaurant details");
        }
    } catch (error) {

        if (newImage?.fileId) {
            try {
                await deleteFromImageKit(newImage.fileId);
            } catch (deleteError) {
                console.error("New image cleanup failed:", deleteError);
            }
        }

        throw error;
    }

    if (newImage && restaurantExists.fileId) {
        try {
            await deleteFromImageKit(restaurantExists.fileId);
        } catch (error) {
            console.error("Previous image deletion failed:", error);
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            restaurant,
            "Restaurant details updated successfully"
        )
    );
});

export {
    loginRestaurant,
    logoutRestaurant,
    currentRestaurant,
    getRestaurantInfo,
    addDetails
}
