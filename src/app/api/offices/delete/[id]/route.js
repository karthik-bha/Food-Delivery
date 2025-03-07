import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

// Deleting office deletes all users and mapping of that office
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        
        const { searchParams } = new URL(req.url); // Extract query parameters
        const type = searchParams.get("type"); // Get type from query

        await connectDB();

        // const users = await User.find({ office_id: id });

        // await User.deleteMany({ office_id: id });
        let deletedOffice = null;
        // Delete the restaurant or smalloffice and their corresponding mappings
        if (type === "Restaurant") {
            // Handles removal of mapping for restaurant 
            await OfficeAndRestaurantMapping.deleteMany({ restaurant_id: id });
            deletedOffice = await RestaurantOffice.findByIdAndDelete(id);

        } else {
            // Handles removal of mapping for small office
            await OfficeAndRestaurantMapping.deleteMany({ office_id: id });
            deletedOffice = await SmallOffice.findByIdAndDelete(id);
        }

        
        return NextResponse.json({ success: true, message: "Office and mapping deleted successfully" , deletedOffice }, {status:200});

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Failed to delete office" }, { status: 500 });
    }
}