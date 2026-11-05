import {Router} from "express";
import {
    createReservation,
    deleteReservation,
    getUserReservations,
    getRestaurantReservations
} from "../controllers/reservations.controller.js";
import { verifyUser } from "../middlewares/oauth.middleware.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";

const router = Router();

router.route("/create").post(verifyUser, createReservation);
router.route("/delete/:id").delete(verifyUser, deleteReservation);
router.route("/user").get(verifyUser, getUserReservations);
router.route("/restaurant").get(verifyRestaurants, getRestaurantReservations);

export default router;