import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

// This route is exclusive for office admin to fetch all staff
export async function GET(req) {
    try {
        const response = await authMiddleware(req);
        if (response) {
            return response;
        }
        const { _id: officeAdminId, role } = req.user;
        if (role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }
        await connectDB();
        const { office_id } = await User.findById(officeAdminId);
        const staffDetails = await User.find({ office_id, role:"office_staff" });
        return NextResponse.json({ success: true, message: "Fetch Success" , staffDetails}, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}