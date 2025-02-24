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
        const { itemId, price, isGuest = false } = await req.json();

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const office = await SmallOffice.findById(user.office_id);
        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        console.log("Before update:", office.additional_items, office.guest_items);

        if (isGuest) {
            // Check if item already exists in `guest_items`
            const existingGuestItem = office.guest_items.find(item => 
                item.item.toString() === itemId && item.addedBy.toString() === userId
            );

            if (existingGuestItem) {
                existingGuestItem.quantity += 1; // Increment quantity
            } else {
                // Add new guest item
                office.guest_items.push({
                    addedBy: userId,
                    item: itemId,
                    quantity: 1,
                    price
                });
            }
        } else {
            // MongoDB update query using $set and $inc
            const updateQuery = {
                $inc: {
                    [`additional_items.${userId}.${itemId}.quantity`]: 1
                },
                $set: {
                    [`additional_items.${userId}.${itemId}.price`]: price
                }
            };

            await SmallOffice.updateOne({ _id: office._id }, updateQuery);
        }


        await office.save();

        console.log("After update:", office.additional_items, office.guest_items);

        return NextResponse.json({ success: true, message: "Item added successfully", office });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error while adding item" }, { status: 500 });
    }
}
