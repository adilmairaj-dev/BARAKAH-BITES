import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";
import Table from "../models/tables.models.js";

const createTable = asyncHandler(async (req, res) => {
    const {tableNumber, capacity, floor} = req.body;
    if (!tableNumber || !capacity || !floor) {
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
    const table = await Table.create({
        tableNumber,
        capacity,
        status: 'available',
        floor,
        image: result.url,
        fileId: result.fileId,
        restaurant: restaurantId
    });
    if (!table) {
        throw new ApiError(500, "Table creation failed");
    }
    res.status(201).json(new ApiResponse(201, table, "Table created successfully"));
})

const deleteTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Table ID is required");
    }
    const table = await Table.findById(id);
    if (!table) {
        throw new ApiError(404, "Table not found");
    }
    if (table.fileId) {
        await deleteFromImageKit(table.fileId);
    }
    await table.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Table deleted successfully"));
})

const getAllTables = asyncHandler(async (req, res) => {
    const tables = await Table.find();
    res.status(200).json(new ApiResponse(200, tables, "Tables retrieved successfully"));
})

export {
    createTable,
    deleteTable,
    getAllTables
}
