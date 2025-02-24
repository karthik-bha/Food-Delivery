import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";

// This edit route is exclusive to office admins to edit staff details
export async function PUT(req, { params }) {

    const {staffId} = await params;

    // Authenticate the user
    const response = await authMiddleware(req);

    if (response) return response; // If auth fails, return response
    try {
        await connectDB();

        // Get office details from JWT
        const { _id: officeAdminId, role } = req.user;
        const { isActive, isVeg, name, email, phone, excludeMeal } = await req.json();
 
        // Check if user is office admin
        if (role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Check if staff id was given
        if (!staffId) {
            return NextResponse.json({ success: false, message: "Staff ID is required" }, { status: 400 });
        }

        // Reject empty requests
        if (!name && !email && !phone && isVeg === undefined && isActive === undefined) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        // Update the selected
        const updatedOfficeStaff = await User.findByIdAndUpdate(
            staffId,
            { name, email, phone, isVeg, isActive, excludeMeal, updatedBy: officeAdminId },
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
