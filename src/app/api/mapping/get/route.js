import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
export async function GET(req) {
    try {

        const response = await authMiddleware(req);

        if (response) return response;

        const { _id: userId, role } = req.user;
        console.log(userId);
        let mappings = null;

        await connectDB();

        // Return all mappings for super admin and admin (we'll decide on the filtering for admin later)
        if (role === "super_admin" || role === "admin") {
            mappings = await OfficeAndRestaurantMapping.find({});
        }

        // Fetch all mappings that contain this restaurants id
        else if (role === "restaurant_owner") {
            const office = await User.findById(userId);

            if (!office) return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
            
            const { office_id } = office;
            mappings = await OfficeAndRestaurantMapping.find({ restaurant_id: office_id }).populate("office_id");
        }

        return NextResponse.json({ success: true, message: "Successful fetch",  mappings });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}