import { Router } from "express";
import { createOrder, getRestaurantOrders, updateOrderStatus, deleteOrder } from "../controllers/order.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/restaurant").get(verifyRestaurants, getRestaurantOrders);
router.route("/:id/status").patch(verifyRestaurants, updateOrderStatus);
router.route("/:id").delete(verifyRestaurants, deleteOrder);

export default router;

