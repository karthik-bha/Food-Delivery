import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import { NextResponse } from "next/server";


export  async function POST(req) {
   
    try {
        await connectDB();
        const { restaurant_id, office_id, isActive } = await req.json();

        if (!restaurant_id || !office_id || typeof isActive !== "boolean") {
            return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
        }

        const updatedMapping = await OfficeAndRestaurantMapping.findOneAndUpdate(
            { restaurant_id, office_id },
            { isActive },
            { new: true }
        );

        if (!updatedMapping) {
            return NextResponse.json({ success: false, message: "Mapping not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Mapping status updated", updatedMapping }, { status: 200 });

    } catch (error) {
        console.error("Error updating mapping status:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
