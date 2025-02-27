import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";

// This route is only for office Admin 
export async function PUT(req) {
    // Authenticate the user
    const response = await authMiddleware(req);
    if (response) return response; // If auth fails, return response
    try {
        await connectDB();
        // Get user details from JWT
        const { _id: staffId} = req.user;

        // Check if staff exists
        const staffExists = await User.findById(staffId);
        if (!staffExists) return NextResponse.json({ success: false, message: "Staff doesnt exist" }, { status: 404 });

        // Get data from req
        const { isVeg, isActive, excludeMeal } = await req.json();

        // Update the user
        const updatedOfficeStaff = await User.findByIdAndUpdate(
            staffId,
            { isVeg, isActive, excludeMeal, updatedBy: staffId },
            { new: true }
        );

        if (!updatedOfficeStaff) {
            return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Staff details updated successfully", updatedOfficeStaff });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error" });
    }
}
