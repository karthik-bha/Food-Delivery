import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import User from "@/lib/models/userSchema";
import { signToken } from "@/lib/jwt";

export async function POST(req) {

    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }
    try {
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
        const token = signToken(user);
        return NextResponse.json({ success: true, message: "Login successful", token }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }


}