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


        let { name, email, phone, street_address, district, state, isActive, timeLimit } = await req.json();

        // Get associated office_id from restOwnerId
        const user = await User.findById(restOwnerId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "Restaurant office not found" }, { status: 404 });
        }

        // Checking if given timeLimit is valid or not
        if (timeLimit) {
            if (!/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(timeLimit)) {
                return NextResponse.json({ success: false, message: "Invalid timeLimit format. Use this format (HH:MM AM/PM) eg: 07:00 AM." },
                    { status: 400 });
            }
            // Converting user time to 24-hour format
            const [time, period] = timeLimit.split(" "); // Separate time and AM/PM
            let [hours, minutes] = time.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0; // Handle midnight
            
            timeLimit = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

            console.log(timeLimit);
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
