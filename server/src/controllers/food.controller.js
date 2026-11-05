import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Food from "../models/food.models.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

const createFood = asyncHandler(async (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price) {
        throw new ApiError(400, "All fields are required");
    }
    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }
    const restaurantId = req.restaurant._id;
    if (!restaurantId) {
        throw new ApiError(400, "Restaurant ID is required");
    }
    
    const result = await uploadToImageKit(req.file.buffer, req.file.originalname, `/restaurants/${restaurantId}`);
    if (!result) {
        throw new ApiError(500, "Image upload failed");
    }

    const food = await Food.create({
        name,
        description,
        price,
        category: category || 'main',
        image: result.url,
        fileId: result.fileId,
        restaurant: restaurantId
    });

    if (!food) {
        throw new ApiError(500, "Food creation failed");
    }

    res.status(201).json(new ApiResponse(201, food, "Food created successfully"));
})

const updateFood = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Food ID is required");
    }

    const food = await Food.findById(id);
    if (!food) {
        throw new ApiError(404, "Food not found");
    }

    const { name, description, price, category } = req.body;

    if (name !== undefined && name !== '') food.name = name;
    if (description !== undefined && description !== '') food.description = description;
    if (price !== undefined && price !== '') food.price = Number(price);
    if (category !== undefined && category !== '') food.category = category;

    if (req.file) {
        const restaurantId = req.restaurant?._id || food.restaurant;
        const result = await uploadToImageKit(req.file.buffer, req.file.originalname, `/restaurants/${restaurantId}`);
        if (result) {
            if (food.fileId) {
                await deleteFromImageKit(food.fileId);
            }
            food.image = result.url;
            food.fileId = result.fileId;
        }
    }

    await food.save();

    res.status(200).json(new ApiResponse(200, food, "Food updated successfully"));
});

const deleteFood = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Food ID is required");
    }
    const food = await Food.findById(id);
    if (!food) {
        throw new ApiError(404, "Food not found");
    }
    if (food.fileId) {
        await deleteFromImageKit(food.fileId);
    }
    await food.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Food deleted successfully"));
})

const getAllFoods = asyncHandler(async (req, res) => {
    const foods = await Food.find();
    res.status(200).json(new ApiResponse(200, foods, "Foods retrieved successfully"));
})

export { createFood, updateFood, deleteFood, getAllFoods };
