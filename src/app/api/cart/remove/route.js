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
        const { itemId } = await req.json();  // Item ID to be removed from the cart

        await connectDB();

        // Find the user's office
        const { office_id } = await User.findById(userId);
        const office = await SmallOffice.findById(office_id);

        // Find the index of the item in the additional_items array
        const itemIndex = office.additional_items.findIndex(
            (item) => item.item.toString() === itemId
        );

        if (itemIndex !== -1) {
            const item = office.additional_items[itemIndex];                        
            if (item.quantity > 1) {
                // Reduce quantity by 1
                item.quantity -= 1;              

                // Update the `updatedBy` field to the user making the update
                item.updatedBy = userId;
            } else {
                // If quantity is 1, remove the item from the additional_items array
                office.additional_items.splice(itemIndex, 1);
            }

            // Save the updated office document
            await office.save();

            return NextResponse.json({
                success: true,
                message: "Item removed successfully",
                office, 
            });
        }

        return NextResponse.json({
            success: false,
            message: "Item not found in cart",
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                message: "Error while removing item",
            },
            { status: 500 }
        );
    }
}
