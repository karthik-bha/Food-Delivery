import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const response = await authMiddleware(req);
        if (response) return response; // If auth fails, return response

        const { _id: adminId, role } = req.user;

        if (role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        await connectDB();


        // Get ids from frontend
        const { smallOfficeId, restaurantOfficeId } = await req.json();

        if (!smallOfficeId || !restaurantOfficeId) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        // Check if offices exist (extra security)
        const smallOffice = await SmallOffice.findById(smallOfficeId);
        const restaurantOffice = await RestaurantOffice.findById(restaurantOfficeId);

        if (!smallOffice || !restaurantOffice) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        // Check if this office already has a mapping
        const existingMapping = await OfficeAndRestaurantMapping.findOne({ office_id:smallOfficeId });

        // If mapping exists, we'll update it
        if (existingMapping) {
           const updatedMapping = await OfficeAndRestaurantMapping.findByIdAndUpdate(
                existingMapping._id,
                {
                    office_id: smallOfficeId,
                    restaurant_id: restaurantOfficeId,
                    updatedBy: adminId
                },
                { new: true }
            );
            return NextResponse.json({ success: true, message: "Mapping updated" , updatedMapping}, { status: 200 });
        }

        // If no mapping exists, create a new one
        const newMapping = new OfficeAndRestaurantMapping({
            office_id: smallOfficeId,
            restaurant_id: restaurantOfficeId,
            createdBy: adminId,
        });

        await newMapping.save();
        
        return NextResponse.json({ success: true, message: "Mapping created", newMapping }, { status: 201 });

    } catch (err) {
        console.error("Error Mapping:", err);
        return NextResponse.json({ success: false, message: "Server error while mapping" }, { status: 500 });
    }
}
