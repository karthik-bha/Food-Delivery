import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import User from "@/lib/models/userSchema";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connectDB";

export async function POST(req) {

    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }
    try {
        await connectDB();
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 400 });
        }
        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 400 });
        }
        // Generate JWT token
        const token = await signToken(user);
        const cookie=await cookies();

        // Set the token as a HTTP-only cookie (js cant access it)
        cookie.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });
        console.log(user.role);
        // Determine Redirect URL Based on Role
        let redirectURL = "/dashboard";
        if (user.role === "super_admin") redirectURL = "/dashboard/superAdmin";
        if (user.role === "admin") redirectURL = "/dashboard/admin";
        if (user.role === "restaurant_owner") redirectURL = "/dashboard/restaurantOwner";
        if (user.role === "office_admin") redirectURL = "/dashboard/officeAdmin";
        if (user.role === "office_staff") redirectURL = "/dashboard/officeStaff";

        return NextResponse.json({success:true, message: "Login successful", redirect: redirectURL }, { status: 200 });
        
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }


}