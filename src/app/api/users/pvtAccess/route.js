import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

// This fetches the exclusive data of each user irrespective of role (used for landing page usually)
export async function GET(req) {
    try {
        const response = await authMiddleware(req);
        if (response) {
            return response;
        }
        const { _id: userId } = req.user;
        await connectDB();
        const userData = await User.findById(userId);
        return NextResponse.json({ success: true, message: "Fetch success", userData });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Fetch fail", userData })
    }
}