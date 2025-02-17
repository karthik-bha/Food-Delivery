import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";

export async function GET(req) {
    try {
        await connectDB();

        // Apply authentication middleware
        const response = await authMiddleware(req);
        if (response) return response;

        if (!req.user) {
            return NextResponse.json({ success: false, 
                message: "Unauthorized: No user found" },
                 { status: 401 });
        }

        const { _id: userId, role } = req.user;

        if (role !== "restaurant_owner" && role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" },
                 { status: 403 });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "No associated office found" }, { status: 404 });
        }

        let officeId;

        // Fetch directly if restaurant owner using API
        if (role === "restaurant_owner") {
            officeId = user.office_id;
        } else {
            // Fetch mapped restaurant for office_admin
            const restaurantMapping = await OfficeAndRestaurantMapping.findOne({ office_id: user.office_id });
            if (!restaurantMapping) {
                return NextResponse.json({ success: false, message: "No restaurant mapped!" }, { status: 404 });
            }
            officeId = restaurantMapping.restaurant_id;
        }

        // Fetch restaurant office details
        const officeDetails = await RestaurantOffice.findById(officeId);
        if (!officeDetails) {
            return NextResponse.json({ success: false, message: "Office details not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Fetch Success", officeDetails }, { status: 200 });

    } catch (err) {
        console.error("Error fetching office details:", err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}
