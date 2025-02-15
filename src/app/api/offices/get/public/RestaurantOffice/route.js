import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
import AdminOffice from "@/lib/models/AdminOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

// This route gets all Restaurant offices or  Restaurant offices filtered by state and district
export async function GET(req) {

    try {

        // We can remove this later if needed
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId, role } = req.user;

        if (role !== "admin" && role !== "super_admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not available" }, { status: 400 });
        }

        await connectDB();


        // Return all smalloffices for super admin
        if (role === "super_admin") {

            const offices = await RestaurantOffice.find({});
            return NextResponse.json({ success: true, message: "Fetch Success", data: offices }, { status: 200 });
        }

        // Return filtered smalloffices
        const { office_id } = await User.findById(userId);
        const { state, district } = await AdminOffice.findById(office_id);
        const restOffices = await RestaurantOffice.find({ state:state, district:district });
        return NextResponse.json({ success: true, message: "Fetch Success",  restOffices }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}