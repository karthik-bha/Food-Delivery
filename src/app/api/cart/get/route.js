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

        // Fetch office details and populate guest item references
        const office = await SmallOffice.findById(user.office_id).populate("guest_items.item");
        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        // Extract additional items for the specific user
        const additionalItems = office.additional_items[userId] || {};

        
        // Format guest orders properly
        const guestItems = office.guest_items.map((guestItem) => ({
            item: guestItem.item._id,
            name: guestItem.item.name, // Populated item name
            price: guestItem.price,
            quantity: guestItem.quantity,
            addedBy: guestItem.addedBy
        }));

        return NextResponse.json({
            success: true,
            message: "Fetch success",
            additionalItems,  
            guest_items: guestItems             
        }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}
