import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req) {

    const response = await authMiddleware(req);
    if (response) return response;
    const { _id: adminId, role } = req.user;

    try {

        // We need to get all officeAdmins related to all offices under this admin
        // We will first get office_ids through mapping
        await connectDB();

        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Get admin office_id
        const { office_id } = await User.findById(adminId);

        // Get details like district and state from admin office
        const { district, state } = await AdminOffice.findById(office_id);

        // Get all users who have office in this district and state
        const restOwners = await User.find({ role: "restaurant_owner" }).populate({ path: "office_id", match: { district: district, state: state } });

        return NextResponse.json({ success: true, message: "Successful fetch", restOwners });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}