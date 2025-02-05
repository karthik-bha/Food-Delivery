import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import Office from "@/lib/models/officeSchema";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middleware/auth";

// Creates a new office staff
export async function POST(req) {
    // Apply the authentication middleware
    const response = authMiddleware(req);
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }
    // Get user data from decoded token 
    const { _id: officeAdminId, role, office_id } = req.user;

    // Check if the user has the right role (office_admin)
    if (role !== "office_admin") {
        return NextResponse.json({ success: false, message: "Only office admins can add staff" }, { status: 403 });
    }

    const { email, password, mealPreference } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and Password are required" }, { status: 400 });
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

        // Find the office by ID from decoded token (office_id from the token)
        const office = await Office.findById(office_id);
        if (!office) {
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
            email,
            password: hashedPassword,
            role: "office_staff",
            office_id: office_id || officeAdmin.office_id // Ensure the staff is assigned to the correct office
        });

        // Add staff to the office's `staff` array
        await Office.updateOne(
            { _id: office_id },
            {
                // This appends the new staff to staff array
                $push: {
                    staff: {
                        user_id: newStaff._id,
                        status: "present", // Default status
                        Meal: mealPreference || "Veg" // Default to Veg if no preference
                    }
                }
            }
        );

        return NextResponse.json({ success: true, message: "Staff created and assigned successfully", data: newStaff }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}
