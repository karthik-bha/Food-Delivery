import { authMiddleware } from "@/lib/middleware/auth";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        // Check authentication
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: restOwnerId, role } = req.user;

        // Ensure only restaurant owners can update
        if (role !== "restaurant_owner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

       
        const { name, email, phone, street_address, district, state, isActive, timeLimit } = await req.json();

        // Get associated office_id from restOwnerId
        const user = await User.findById(restOwnerId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "Restaurant office not found" }, { status: 404 });
        }

        // Validate timeLimit format (HH:MM, 24-hour format)
        if (timeLimit && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeLimit)) {
            return NextResponse.json({ success: false, message: "Invalid timeLimit format. Use HH:MM (24-hour format)." }, 
                { status: 400 });
        }
        
        // Update restaurant office details
        const updatedOffice = await RestaurantOffice.findByIdAndUpdate(
            user.office_id,
            { name, phone, email, street_address, district, state, isActive, timeLimit, updatedBy: restOwnerId },
            { new: true } 
        );

        if (!updatedOffice) {
            return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Update successful", updatedOffice }, { status: 200 });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
