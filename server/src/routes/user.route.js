import {Router} from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    currentUser
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/oauth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUser, logoutUser);
router.route("/current").get(verifyUser, currentUser);

export default router;