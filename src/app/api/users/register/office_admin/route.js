import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middleware/auth";

export async function POST(req) {
    // Apply the authentication middleware
    const response =  await authMiddleware(req);
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response; 
    }

    // req.user should be set by the middleware if authentication is successful
    // Access the user data attached by the middleware
    const { _id: adminId, role } = req.user;

    // Check if the user has the right role (admin)
    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Only admins can add office_admin" }, { status: 403 });
    }

    const { email, password, office_id } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and Password are required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if the admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ success: false, message: "Invalid admin" }, { status: 403 });
        }

        // Check if the email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, message: "Email Already Exists" }, { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new office_admin user
        const officeAdminUser = new User({
            email,
            password: hashedPassword,
            role: "office_admin",
            office_id,
        });

        await officeAdminUser.save();

        // Respond with the newly created user details
        return NextResponse.json({
            message: "Office Admin Registered Successfully, Please Register Your Office and Staff",
            newUser: officeAdminUser,
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
