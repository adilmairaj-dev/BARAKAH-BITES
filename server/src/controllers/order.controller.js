import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Order from "../models/order.models.js";
import Restaurant from "../models/restaurants.models.js";

const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, specialInstructions, items, totalAmount, restaurantId } = req.body;

  if (!customerName || !phone || !address) {
    throw new ApiError(400, "Customer name, phone, and address are required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one item is required in the order");
  }

  let restaurant = null;
  if (restaurantId) {
    restaurant = await Restaurant.findById(restaurantId);
  }
  if (!restaurant) {
    restaurant = await Restaurant.findOne();
  }
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const orderId = 'BB-' + Math.floor(100000 + Math.random() * 900000);

  const formattedItems = items.map(item => ({
    food: item.food?._id || item.food || null,
    name: item.food?.name || item.name || 'Dish',
    price: Number(item.food?.price || item.price || 0),
    quantity: Number(item.quantity || 1),
    image: item.food?.image || item.image || ''
  }));

  const calculatedTotal = totalAmount || formattedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const order = await Order.create({
    orderId,
    restaurant: restaurant._id,
    customerName,
    phone,
    address,
    specialInstructions: specialInstructions || '',
    items: formattedItems,
    totalAmount: calculatedTotal,
    status: 'placed'
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }

  res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant?._id;
  if (!restaurantId) {
    throw new ApiError(401, "Unauthorized: Restaurant ID required");
  }

  const orders = await Order.find({ restaurant: restaurantId }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const restaurantId = req.restaurant?._id;
  const order = await Order.findOne({ _id: id, restaurant: restaurantId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurantId = req.restaurant?._id;
  const order = await Order.findOneAndDelete({ _id: id, restaurant: restaurantId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
});

export { createOrder, getRestaurantOrders, updateOrderStatus, deleteOrder };

