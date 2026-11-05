import "./configs/env.js";

import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

import userRoutes from "./routes/user.route.js"
import restaurantRoutes from "./routes/restaurants.route.js"
import foodRoutes from "./routes/food.route.js"
import tableRoutes from "./routes/table.route.js"
import reservationRoutes from "./routes/reservations.route.js"
import orderRoutes from "./routes/order.route.js"
import errorHandler from "./middlewares/error.middleware.js";

app.use("/api/user", userRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/table", tableRoutes)
app.use("/api/reservation", reservationRoutes)
app.use("/api/order", orderRoutes)
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Barakah Bites API" });
})

export default app