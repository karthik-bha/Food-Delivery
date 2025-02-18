import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";

// Fetches exclusive office related to office admin
export async function GET(req) {
    try {
        // Apply authentication middleware
        const response = await authMiddleware(req);
        if (response) return response;

        console.log(req.user);
        const { _id: userId } = req.user;
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not available" }, { status: 400 });
        }
        
        await connectDB();

        // Get the office_id of the logged-in user
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }
        
        const { office_id } = user;
        
        // Fetch office details
        const officeData = await SmallOffice.findById(office_id);
        if (!officeData) {
            return NextResponse.json({ success: false, message: "Office data not found" }, { status: 404 });
        }

        // Fetch all staff members related to the office
        const staffDetails = await User.find({ office_id, role: "office_staff" });

        // Calculate staff statistics
        const totalStaff = staffDetails.length;
        const vegCount = staffDetails.filter(staff => staff.isVeg && staff.isActive).length;       
        const activeCount = staffDetails.filter(staff => staff.isActive).length;
        const nonVegCount = activeCount - vegCount;

        return NextResponse.json({
            success: true,
            message: "Fetch Success",
            officeData,
            staffStats: {
                totalStaff,
                vegCount,
                nonVegCount,
                activeCount
            }
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}

