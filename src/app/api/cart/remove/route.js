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
        const { itemId, isGuest = false } = await req.json();

        await connectDB();

        // Find the user's office
        const { office_id } = await User.findById(userId);
        const office = await SmallOffice.findById(office_id);

        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        if (isGuest) {
            // Handle removing guest items
            const guestItemIndex = office.guest_items.findIndex(
                (item) => item.item.toString() === itemId
            );

            if (guestItemIndex === -1) {
                return NextResponse.json({ success: false, message: "Guest item not found in cart" }, { status: 404 });
            }

            if (office.guest_items[guestItemIndex].quantity > 1) {
                // Reduce quantity if more than 1
                await SmallOffice.updateOne(
                    { _id: office._id },
                    { $inc: { [`guest_items.${guestItemIndex}.quantity`]: -1 } }
                );
            } else {
                // Remove the item if quantity is 1
                await SmallOffice.updateOne(
                    { _id: office._id },
                    { $pull: { guest_items: { item: itemId } } }
                );
            }

        } else {
            if (!office.additional_items[userId] || !office.additional_items[userId][itemId]) {
                return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
            }

            const itemQuantity = office.additional_items[userId][itemId].quantity;

            if (itemQuantity > 1) {
                // Reduce quantity if more than 1
                await SmallOffice.updateOne(
                    { _id: office._id },
                    { $inc: { [`additional_items.${userId}.${itemId}.quantity`]: -1 } }
                );
            } else {
                // Remove only the specific item if quantity is 1
                await SmallOffice.updateOne(
                    { _id: office._id },
                    { $unset: { [`additional_items.${userId}.${itemId}`]: "" } }
                );

                // Fetch the updated office to check if user has any items left
                const updatedOffice = await SmallOffice.findById(office._id);
                const remainingItems = Object.keys(updatedOffice.additional_items[userId] || {}).length;

                if (remainingItems === 0) {
                    // Remove the user entry from additional_items if no items remain
                    await SmallOffice.updateOne(
                        { _id: office._id },
                        { $unset: { [`additional_items.${userId}`]: "" } }
                    );
                }
            }
        }

        // Fetch the latest office state after all updates
        const updatedOffice = await SmallOffice.findById(office._id);

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
