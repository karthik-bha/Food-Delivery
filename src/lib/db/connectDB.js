import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false; 

export async function connectDB() {
    if (isConnected) {
        return; 
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true; 
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
