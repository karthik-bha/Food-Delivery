import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";

export async function GET(req) {
    try {
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId } = req.user;
        await connectDB();

        // Find user's office_id
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "User or office not found" }, { status: 404 });
        }

        // Fetch office details
        const office = await SmallOffice.findById(user.office_id);
        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        // Extract additional items for the specific user
        const additionalItems = office.additional_items[userId] || {};

        return NextResponse.json({ success: true, message: "Fetch success", additionalItems }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}
