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
        await connectDB();

        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Get admin details
        const admin = await User.findById(adminId);
        if (!admin || !admin.office_id) {
            return NextResponse.json({ success: false, message: "Admin or office not found" }, { status: 404 });
        }

        // Get admin office details
        const adminOffice = await AdminOffice.findById(admin.office_id);
        if (!adminOffice) {
            return NextResponse.json({ success: false, message: "Admin office not found" }, { status: 404 });
        }

        // Get restaurant owners with offices in the same district and state
        const restOwners = await User.find({
            role: "restaurant_owner",
        }).populate({
            path: "office_id",
        });

        // Filter out users whose office does not match
        const filteredOwners = restOwners.filter(
            (owner) => owner.office_id?.district === adminOffice.district && owner.office_id?.state === adminOffice.state
        );

        return NextResponse.json({ success: true, message: "Successful fetch", restOwners: filteredOwners });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}
