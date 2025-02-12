import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import SmallOffice from "@/lib/models/SmallOffice";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middleware/auth";

// Creates a new office staff
export async function POST(req) {
    // Apply the authentication middleware
    const response = await authMiddleware(req);
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }
    // Get user data from decoded token 
    const { _id: officeAdminId, role } = req.user;

    // Check if the user has the right role (office_admin)
    if (role !== "office_admin") {
        return NextResponse.json({ success: false, message: "Only office admins can add staff" }, { status: 403 });
    }

    const { name, phone, email, password, isVeg } = await req.json();

    if (!email || !password || !name || !phone) {
        return NextResponse.json({ success: false, message: "Email, Name, Phone and Password are required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if the office admin exists 
        const officeAdmin = await User.findById(officeAdminId);
        if (!officeAdmin || officeAdmin.role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Invalid office admin" }, { status: 403 });
        }
        if (!officeAdmin.office_id) {
            return NextResponse.json({ success: false, message: "Create office before staff" }, { status: 403 });
        }
        console.log(officeAdmin.office_id);
        // Find the office by ID from decoded token (office_id from the token)
        const office = await SmallOffice.findById(officeAdmin.office_id);
        if (!office || !officeAdmin.office_id) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        // Check if the staff user already exists
        const existingStaff = await User.findOne({ email });
        if (existingStaff) {
            return NextResponse.json({ success: false, message: "Staff with this email already exists" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new staff user
        const newStaff = await User.create({
            name,
            phone,
            email,
            isVeg,
            password: hashedPassword,
            office_type: 3,
            role: "office_staff",
            office_id: officeAdmin.office_id, // Ensures the staff is assigned to the correct office
            createdBy: officeAdminId
        });

        return NextResponse.json({ success: true, message: "Staff created and assigned successfully", newStaff }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}
