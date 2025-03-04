import express from "express";
import next from "next";
import dotenv from "dotenv";
import scheduleAllJobs from "./cronTest.js";


dotenv.config();

const app = next({ dev: process.env.NODE_ENV !== "production" }); // Ensures dev mode
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Run cron job scheduling when the server starts
    scheduleAllJobs();

    // Handle all API routes and Next.js pages
    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server ready on http://localhost:${PORT}`);
    });
});
