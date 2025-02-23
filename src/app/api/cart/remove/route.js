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

        // Extract user details and request data
        const { _id: userId } = req.user;
        const { itemId } = await req.json();

        await connectDB();

        // Find the user's office
        const { office_id } = await User.findById(userId);
        const office = await SmallOffice.findById(office_id);

        if (!office || !office.additional_items[userId]) {
            return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
        }

        // Check if the item exists
        if (!office.additional_items[userId][itemId]) {
            return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
        }

        // Prepare the update query
        let updateQuery = {};
        const itemCount = Object.keys(office.additional_items[userId]).length;

        if (itemCount === 1) {
            // Remove the entire user entry if it's their last item
            updateQuery = { $unset: { [`additional_items.${userId}`]: "" } };
        } else {
            // Reduce quantity if more than one
            if (office.additional_items[userId][itemId].quantity > 1) {
                updateQuery = { 
                    $inc: { [`additional_items.${userId}.${itemId}.quantity`]: -1 }
                };
            } else {
                // Remove only the specific item if quantity is 1
                updateQuery = { 
                    $unset: { [`additional_items.${userId}.${itemId}`]: "" }
                };
            }
        }

        // Perform the update
        const updatedOffice = await SmallOffice.findByIdAndUpdate(
            office._id,
            updateQuery,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Item removed successfully",
            office: updatedOffice,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Error while removing item" },
            { status: 500 }
        );
    }
}
