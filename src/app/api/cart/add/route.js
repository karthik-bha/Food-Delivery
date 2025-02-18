import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Authenticate user
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId } = req.user;
        const { itemId, price } = await req.json();

        await connectDB();

        // Find the user's office
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Find office by user's office_id
        const office = await SmallOffice.findById(user.office_id);
        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        const itemExists = office.additional_items.find((item) => item.item.toString() === itemId);

        if (itemExists) {
            // Updating item if it  exists
            itemExists.quantity += 1;           
            itemExists.updatedBy = userId;
        } else {
            // Adding new item to the office's additional_items
            office.additional_items.push({
                item: itemId,
                quantity: 1,
                addedBy: userId,
                updatedBy: userId,
            });
        }

        await office.save();

        // Return a success response with the updated office data
        return NextResponse.json({ success: true, message: "Item added successfully", office });

    } catch (err) {
        console.log(err);
        // Return an error response in case of failure
        return NextResponse.json({ success: false, message: "Error while adding to items" }, { status: 500 });
    }
}
