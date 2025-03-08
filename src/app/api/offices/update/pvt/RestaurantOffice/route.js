import { authMiddleware } from "@/lib/middleware/auth";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        // Check authentication
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId, role } = req.user;

        // Only allow restaurant owners and admins
        if (role !== "restaurant_owner" && role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Parse request body
        let { name, email, phone, street_address, district, state, isActive, timeLimit, _id: office_id } = await req.json();

        // Validate timeLimit first
        if (timeLimit) {
            if (!/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(timeLimit)) {
                return NextResponse.json(
                    { success: false, message: "Invalid timeLimit format. Use HH:MM AM/PM (e.g., 07:00 AM)." },
                    { status: 400 }
                );
            }
            // Convert to 24-hour format
            const [time, period] = timeLimit.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            timeLimit = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }

        if (role === "admin") {
            // Admin must provide office_id to update a restaurant
            if (!office_id) {
                return NextResponse.json({ success: false, message: "Office is required for admins" }, { status: 400 });
            }

            // Check if the restaurant office exists
            const office = await RestaurantOffice.findById(office_id);
            if (!office) {
                return NextResponse.json({ success: false, message: "Restaurant office not found" }, { status: 404 });
            }
        } else {
            // If restaurant_owner, get their assigned office
            const user = await User.findById(userId);
            if (!user || !user.office_id) {
                return NextResponse.json({ success: false, message: "Restaurant office not found" }, { status: 404 });
            }
            office_id = user.office_id; // Restrict to the owner's office 
        }

        // Validate required fields (except isActive, which is optional)
        if (!name || !email || !phone || !street_address || !district || !state) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find and update the office
        const updatedOffice = await RestaurantOffice.findByIdAndUpdate(
            office_id,
            { name, phone, email, street_address, district, state, isActive, timeLimit, updatedBy: userId },
            { new: true }
        );

        if (!updatedOffice) {
            return NextResponse.json({ success: false, message: "Office not found or update failed" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Update successful", updatedOffice }, { status: 200 });

    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
