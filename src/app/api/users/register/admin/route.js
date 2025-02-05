import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import bcrypt from "bcrypt"
import { authMiddleware } from "@/lib/middleware/auth";

export async function POST(req) {
    
     // Apply the authentication middleware
     const response =  authMiddleware(req);
     
     // If the middleware returns a response (i.e., unauthenticated), stop execution here
     if (response) {
         return response; 
     }
 
    // req.user should be set by the middleware if authentication is successful
    // Access the user data attached by the middleware
    const { _id: superAdminId, role } = req.user;

    // Check if the user has the right role (super_admin)
    if (role !== "super_admin") {
        return NextResponse.json({ success: false, message: "Only super admins can add admin" }, { status: 403 });
    }

    // Extract email and password from request body
    const { email, password, location_city } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and Password are required" }, { status: 400 });
    }
    if(!location_city){
        return NextResponse.json({ success: false, message: "Location is required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if super admin exists
        const superAdmin = await User.findById(superAdminId);
        if (!superAdmin || superAdmin.role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Invalid super admin" }, { status: 403 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, message: "Email Already Exists" }, { status: 400 });
        }
        // Ensure that an admin is assigned to a location
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = new User({
            email,
            password: hashedPassword,
            role: "admin",
            location_city, // Admin needs location
        });

        await adminUser.save();

        return NextResponse.json({
            message: "Admin Registered Successfully",
            newUser: adminUser,
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
