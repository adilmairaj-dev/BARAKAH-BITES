import {Router} from "express";
import {
    createTable,
    deleteTable,
    getAllTables
} from "../controllers/tables.controller.js";
import {verifyRestaurants } from "../middlewares/restaurants.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyRestaurants, upload.single("image"), createTable);
router.route("/delete/:id").delete(verifyRestaurants, deleteTable);
router.route("/all").get(getAllTables);

export default router;