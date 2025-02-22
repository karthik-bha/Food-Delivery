import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const response = await authMiddleware(req);

    if (response) return response;

    const { _id: superAdminId, role } = req.user;

    if (role !== "super_admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { userType } = await params;
    try {

        await connectDB();

        let users;

        if (userType === "admin") {
            users = await User.find({ role: "admin" }).populate("office_id");
        }
        else if (userType === "office_admin") {
            users = await User.find({ role: "office_admin" });
        }
        else if (userType === "restaurant_owner") {
            users = await User.find({ role: "restaurant_owner" });
        }

        return NextResponse.json({ success: true, message: "Successful fetch", users }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}