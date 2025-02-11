import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";

export async function PUT(req) {
    // Authenticate the user
    const response = await authMiddleware(req);
    if (response) return response; // If auth fails, return response
    try {
        await connectDB();

        // Get user details from JWT
        const { _id: userId, role } = req.user;
        const { staffId, isActive, isVeg, name, email, phone } = await req.json();

        // If no fields are provided, return an error
        // if (role === "office_admin") {
        //     if (!name && !email && !phone) {
        //         return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        //     }
        // }

        let updateTargetId = staffId || userId; // Use staffId if admin, else use JWT userId

        // If office staff tries to update someone else, deny it
        if (role === "office_staff" && staffId && staffId !== userId) {
            return NextResponse.json({ success: false, message: "Unauthorized to update other staff" }, { status: 403 });
        }

        // Update the user
        const updatedOfficeStaff = await User.findByIdAndUpdate(
            updateTargetId,
            { name, email, phone, isVeg, isActive, updatedBy: userId },
            { new: true }
        );

        if (!updatedOfficeStaff) {
            return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Staff details updated successfully", updatedOfficeStaff });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error", data: updatedOfficeStaff });
    }
}
