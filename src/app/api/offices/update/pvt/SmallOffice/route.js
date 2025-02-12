import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";

export async function PUT(req) {
    try {
        // Apply authentication middleware
        const response = await authMiddleware(req);

        // If authentication fails, return response
        if (response) return response;

        // Extract user details from request
        const { _id: userId, role } = req.user;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User not available" },
                { status: 400 }
            );
        }

        // Parse request body
        const { isActive, name, email, phone, street_address, district, state } = await req.json();

        // Retrieve office ID from the user record
        const { office_id } = await User.findById(userId);

        // Update office based on role
        if (role === "office_staff") {
            const updatedOffice = await SmallOffice.findByIdAndUpdate(
                office_id,
                { isActive,updatedBy:userId },
                { new: true }
            );
            return NextResponse.json(
                { success: true, message: "Update Success", updatedOffice },
                { status: 200 }
            );
        } 
        
        if (role === "office_admin") {
            const updatedOffice = await SmallOffice.findByIdAndUpdate(
                office_id,
                { isActive, name, email, phone, street_address, district, state,
                    updatedBy:userId
                },
                { new: true }
            );
            return NextResponse.json(
                { success: true, message: "Update Success", updatedOffice },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Unauthorized access" },
            { status: 403 }
        );
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { success: false, message: "Error during update" },
            { status: 500 }
        );
    }
}
