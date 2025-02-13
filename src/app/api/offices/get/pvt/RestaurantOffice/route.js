import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";

export async function GET(req) {
    try {
        // Apply authentication middleware
        const response = await authMiddleware(req);

        // If the middleware returns a response (unauthenticated), stop execution
        if (response) return response;

        // Ensure `req.user` is available
        if (!req.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No user found" },
                { status: 401 }
            );
        }

        const { _id: restOwnerId, role } = req.user;

        if (role !== "restaurant_owner") {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Only restaurant owners can access this" },
                { status: 403 }
            );
        }

        await connectDB();

        // Fetch user with office_id
        const user = await User.findById(restOwnerId);
        if (!user || !user.office_id) {
            return NextResponse.json(
                { success: false, message: "No associated office found for this user" },
                { status: 404 }
            );
        }

        // Fetch office details
        const officeDetails = await RestaurantOffice.findById(user.office_id);
        if (!officeDetails) {
            return NextResponse.json(
                { success: false, message: "Office details not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Fetch Success", officeDetails },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error fetching office details:", err);
        return NextResponse.json(
            { success: false, message: "Error during fetch" },
            { status: 500 }
        );
    }
}
