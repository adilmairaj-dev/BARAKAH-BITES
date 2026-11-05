import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
        const connectionIn = await mongoose.connect(uri, { dbName: DB_NAME });
        console.log("mongoDB connected", connectionIn.connection.host)
    } catch (error) {
        console.log("MongoDB Failed", error?.message)
        process.exit(1)
    }
}

export default connectDB