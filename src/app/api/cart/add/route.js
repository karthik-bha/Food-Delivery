import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId } = req.user;
        const { itemId, price } = await req.json();

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const office = await SmallOffice.findById(user.office_id);
        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        console.log("Before update:", office.additional_items);

        // Ensure `additional_items` is an object before updating
        if (Array.isArray(office.additional_items)) {
            office.additional_items = {};
        }

        // Construct update query
        const updateQuery = {
            $inc: { [`additional_items.${userId}.${itemId}.quantity`]: 1 },
            $set: { [`additional_items.${userId}.${itemId}.price`]: price }
        };

        // Update in MongoDB
        const updatedOffice = await SmallOffice.findByIdAndUpdate(
            office._id,
            updateQuery,
            { new: true, upsert: true }
        );

        console.log("After update:", updatedOffice.additional_items);

        return NextResponse.json({ success: true, message: "Item added successfully", office: updatedOffice });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error while adding item" }, { status: 500 });
    }
}
