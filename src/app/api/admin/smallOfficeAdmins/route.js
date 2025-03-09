import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import SmallOffice from "@/lib/models/SmallOffice";
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

        // Get all office admins
        const officeAdmins = await User.find({
            role: "office_admin",
        }).populate({
            path: "office_id",
        });

        // Filter office admins whose office matches the admin's district and state
        const filteredAdmins = officeAdmins.filter(
            (admin) => admin.office_id?.district === adminOffice.district && admin.office_id?.state === adminOffice.state
        );

        return NextResponse.json({ success: true, message: "Successful fetch", smallOfficeAdmins: filteredAdmins });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}
