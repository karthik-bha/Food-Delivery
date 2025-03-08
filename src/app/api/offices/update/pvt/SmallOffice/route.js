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
        const { isActive, name, email, phone, street_address, district, state, _id:office_id } = await req.json();

        await connectDB();

        // For editing office details from admin side
        if (role === "admin") {

            if (!office_id) {
                return NextResponse.json(
                    { success: false, message: "Office is required" },
                    { status: 400 }
                )
            }

            if (!name || !email || !phone || !street_address) {
                return NextResponse.json(
                    { success: false, message: "Name, Email, Phone and Street address can't be empty" },
                    { status: 400 },
                )
            }

            const updatedOffice = await SmallOffice.findByIdAndUpdate(
                office_id,
                { name, email, phone, street_address, updatedBy: userId },
                { new: true }
            );

            return NextResponse.json(
                { success: true, message: "Update Success", updatedOffice },
                { status: 200 }
            );
        }


        // Update office based on role
        if (role === "office_staff") {
            // Retrieve office ID from the user record
            const { office_id } = await User.findById(userId);
            const updatedOffice = await SmallOffice.findByIdAndUpdate(
                office_id,
                { isActive, updatedBy: userId },
                { new: true }
            );
            return NextResponse.json(
                { success: true, message: "Update Success", updatedOffice },
                { status: 200 }
            );
        }

        if (role === "office_admin") {
            // Retrieve office ID from the user record
            const { office_id } = await User.findById(userId);
            const updatedOffice = await SmallOffice.findByIdAndUpdate(
                office_id,
                {
                    isActive, name, email, phone, street_address, district, state,
                    updatedBy: userId
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
