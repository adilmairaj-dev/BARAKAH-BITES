import {Router} from "express";
import { createFood, updateFood, deleteFood, getAllFoods } from "../controllers/food.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyRestaurants, upload.single("image"), createFood);
router.route("/update/:id").patch(verifyRestaurants, upload.single("image"), updateFood);
router.route("/delete/:id").delete(verifyRestaurants, deleteFood);
router.route("/all").get(getAllFoods);

export default router;