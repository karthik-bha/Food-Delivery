import cron from "node-cron";
import mongoose from "mongoose";
import RestaurantOffice from "../src/lib/models/RestaurantOffice.js";
// import ScheduledJob from "../src/lib/models/ScheduledJob.js";
import { connectDB } from "../src/lib/db/connectDB.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config();

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/auto-order`;
const activeJobs = new Map(); // Stores currently running jobs


const scheduleJob = async (restaurant) => {
    const { timeLimit, _id } = restaurant;
    if (!timeLimit) return console.warn(`Skipping restaurant ${_id} (no timeLimit set).`);

    const restaurantId = _id.toString(); 

    // Convert `timeLimit` to cron format (HH:MM daily)
    const [hours, minutes] = timeLimit.split(":");
    const cronTime = `${minutes} ${hours} * * *`;
   
    // Properly Stop & Remove Old Job Before Scheduling New One
    if (activeJobs.has(restaurantId)) {
        console.log(`Stopping and removing old job for restaurant ${restaurantId}`);
        const oldJob = activeJobs.get(restaurantId);
        oldJob.stop();   
        activeJobs.delete(restaurantId);
    }

    // Schedule new order placement at exact `timeLimit`
    const job = cron.schedule(cronTime, async () => {
        console.log(`Placing order for restaurant ${restaurantId} at ${timeLimit}...`);
        try {
            const response = await fetch(API_URL, { 
                method: "POST", 
                body: JSON.stringify({ restaurantId: restaurantId }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            console.log(`Order placed for restaurant ${restaurantId}:`, data);
        } catch (error) {
            console.error(`Error placing order for restaurant ${restaurantId}:`, error);
        }
    });

    activeJobs.set(restaurantId, job);
    console.log(`Scheduled new job for restaurant ${restaurantId} at ${timeLimit}`);
};



// Function to watch for DB changes (CRUD operations)
const watchForChanges = async () => {
    console.log("Watching for DB changes...");
    const db = mongoose.connection;
    const changeStream = db.collection("restaurantoffices").watch();

    changeStream.on("change", async (change) => {
        console.log("DB Change detected:", change);

        const restaurantId = change.documentKey._id.toString(); // Convert `_id` to string

        if (change.operationType === "insert" || change.operationType === "update") {
            const updatedRestaurant = await RestaurantOffice.findById(change.documentKey._id);
            if (updatedRestaurant) await scheduleJob(updatedRestaurant);
        } 
        
        if (change.operationType === "delete") {
            if (activeJobs.has(restaurantId)) {
                const job = activeJobs.get(restaurantId);
                job.stop(); // Stop the job
                activeJobs.delete(restaurantId); // Remove from activeJobs
                console.log(`Stopped and removed job for deleted restaurant ${restaurantId}`);
            }
        }        
    });
};


// Function to start all jobs initially
const scheduleAllJobs = async () => {
    await connectDB();
    const restaurants = await RestaurantOffice.find({ isActive: true });

    if (!restaurants.length) {
        console.log("No active restaurants found.");
        return;
    }

    for (const restaurant of restaurants) {
        await scheduleJob(restaurant);
    }
};

// Start the script
(async () => {
    await scheduleAllJobs();
    console.log(activeJobs);
    await watchForChanges();
})();

export default scheduleAllJobs;