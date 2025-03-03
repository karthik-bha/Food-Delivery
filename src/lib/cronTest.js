import cron from "node-cron";
import RestaurantOffice from "./models/RestaurantOffice.js";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Correct path for standalone scripts
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

console.log("MONGO_URL:", process.env.MONGO_URL); // Debugging

const API_URL = "http://localhost:3000/api/auto-order";

// Function to schedule jobs for all restaurants
const scheduleOrders = async () => {
    await connectDB();

    const restaurants = await RestaurantOffice.find({ isActive: true });
 

    if (!restaurants.length) {
        console.log("No active restaurants found.");
        return;
    }

    restaurants.forEach((restaurant) => {
        const { timeLimit, _id } = restaurant;

        if (!timeLimit) {
            console.warn(`Skipping restaurant ${_id} (no timeLimit set).`);
            return;
        }

        // Convert `timeLimit` to cron format (HH:MM daily)
        const [hours, minutes] = timeLimit.split(":");
        const cronTime = `${minutes} ${hours} * * *`;

        // Schedule order placement at exact `timeLimit`
        cron.schedule(cronTime, async () => {
            console.log(`Placing order for restaurant ${_id} at ${timeLimit}...`);
            try {
                const response = await fetch(API_URL, { 
                    method: "POST", 
                    body: JSON.stringify({ restaurantId: _id }), // Pass restaurant ID
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                console.log(`Order placed for restaurant ${_id}:`, data);
            } catch (error) {
                console.error(`Error placing order for restaurant ${_id}:`, error);
            }
        });

        console.log(`Scheduled order for restaurant ${_id} at ${timeLimit}`);

        // // Schedule alert 20 minutes before timeLimit
        // let alertMinutes = parseInt(minutes) - 20;
        // let alertHours = parseInt(hours);

        // if (alertMinutes < 0) {
        //     alertMinutes += 60;
        //     alertHours -= 1;
        // }

        // const alertCronTime = `${alertMinutes} ${alertHours} * * *`;

        // cron.schedule(alertCronTime, () => {
        //     console.log(`Alert: 20 minutes left before order for restaurant ${_id}!`);
            
        // });

        // console.log(`Scheduled alert for restaurant ${_id} at ${alertHours}:${alertMinutes}`);
    });
};

// Run scheduling
scheduleOrders();
console.log("Dynamic cron jobs scheduled!");
