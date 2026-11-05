import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Reservation from "../models/reservations.models.js";
import Table from "../models/tables.models.js";
import User from "../models/user.models.js";
import Restaurant from "../models/restaurants.models.js";
import mongoose from "mongoose";

const createReservation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { tableId, restaurantId, date, time } = req.body;
    if (!tableId || !restaurantId || !date || !time) {
        throw new ApiError(400, "All fields are required");
    }
    if(!mongoose.Types.ObjectId.isValid(tableId)) {
        throw new ApiError(400, "Invalid table or restaurant ID");
    }
    if(!mongoose.Types.ObjectId.isValid(restaurantId)) {
        throw new ApiError(400, "Invalid table or restaurant ID");
    }
    const reservation = await Reservation.create({
        user: userId,
        restaurant: restaurantId,
        table: tableId,
        date,
        time,
        status: 'confirmed'
    });
    if (!reservation) {
        throw new ApiError(500, "Reservation creation failed");
    }

    const table = await Table.findByIdAndUpdate(tableId, { status: 'reserved' }, { returnDocument: 'after' });
    if (!table) {
        throw new ApiError(404, "Table not found");
    }
    res.status(201).json(new ApiResponse(201, reservation, "Reservation created successfully"));
})

const deleteReservation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Reservation ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid reservation ID");
    }
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        throw new ApiError(404, "Reservation not found");
    }
    if (reservation.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the owner of this reservation");
    }
    const table = await Table.findByIdAndUpdate(reservation.table, { status: 'available' }, { returnDocument: 'after' });
    if (!table) {
        throw new ApiError(404, "Table not found");
    }
    await reservation.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Reservation deleted successfully"));
})

const getUserReservations = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const reservations = await Reservation.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurant',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $lookup: {
                from: 'tables',
                localField: 'table',
                foreignField: '_id',
                as: 'table'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $unwind: '$table'
        },
        {
            $project: {
                _id: 1,
                date: 1,
                time: 1,
                status: 1,
                restaurant: {
                    _id: '$restaurant._id',
                    name: '$restaurant.name',
                    address: '$restaurant.address'
                },
                table: {
                    _id: '$table._id',
                    tableNumber: '$table.tableNumber',
                    capacity: '$table.capacity',
                    floor: '$table.floor'
                }
            }
        }
    ])
    res.status(200).json(new ApiResponse(200, reservations, "User reservations fetched successfully"));
})

const getRestaurantReservations = asyncHandler(async (req, res) => {
    const restaurantId = req.restaurant._id;
    const reservations = await Reservation.aggregate([
        {
            $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'tables',
                localField: 'table',
                foreignField: '_id',
                as: 'table'
            }
        },
        {
            $unwind: '$table'
        },
        {
            $project: {
                _id: 1,
                date: 1,
                time: 1,
                status: 1,
                user: {
                    _id: '$user._id',
                    name: '$user.name',
                    email: '$user.email'
                },
                table: {
                    _id: '$table._id',
                    tableNumber: '$table.tableNumber',
                    capacity: '$table.capacity',
                    floor: '$table.floor'
                }
            }
        }
    ])
    if (!reservations) {
        throw new ApiError(404, "No reservations found for this restaurant");
    }
    res.status(200).json(new ApiResponse(200, reservations, "Restaurant reservations fetched successfully"));
})

export {
    createReservation,
    deleteReservation,
    getUserReservations,
    getRestaurantReservations
}
