import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import AdditionalMenu from "@/lib/models/AdditionalMenu"; // To fetch item names

export async function GET(req) {
    try {
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId } = req.user;
        const { searchParams } = new URL(req.url);
        const style = searchParams.get("style");

        await connectDB();

        // Find user's office_id
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "User or office not found" }, { status: 404 });
        }

        // Fetch office details and populate guest items
        const office = await SmallOffice.findById(user.office_id)
            .populate({
                path: "guest_items.item",
                select: "name" // Fetch item name
            })
            .populate({
                path: "guest_items.addedBy",
                select: "name" // Fetch user name
            });

        if (!office) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        let additionalItems = [];

        if (style === "order") {
            // Fetch all users in one query to avoid multiple DB calls
            const userIds = Object.keys(office.additional_items);
            const users = await User.find({ _id: { $in: userIds } }).select("name");

            // This maps userId to names
            const userMap = Object.fromEntries(users.map(user => [user._id.toString(), user.name]));

            // Process additionalItems into structured format
            for (const [userId, items] of Object.entries(office.additional_items)) {
                for (const [itemId, { price, quantity }] of Object.entries(items)) {
                    const menuItem = await AdditionalMenu.findById(itemId);
                    additionalItems.push({
                        userId,
                        userName: userMap[userId] || "Unknown User",
                        item: itemId,
                        name: menuItem ? menuItem.name : "Unknown Item",
                        price,
                        quantity
                    });
                }
            }
        } else {
            additionalItems = office.additional_items[userId] || {};
        }

        // Format guest orders properly
        const guestItems = office.guest_items.map((guestItem) => ({
            item: guestItem.item._id,
            name: guestItem.item.name,
            price: guestItem.price,
            quantity: guestItem.quantity,
            addedBy: guestItem.addedBy._id,
            addedByName: guestItem.addedBy.name
        }));

        return NextResponse.json({
            success: true,
            message: "Fetch success",
            additionalItems,
            guest_items: guestItems
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}



// import { authMiddleware } from "@/lib/middleware/auth";
// import SmallOffice from "@/lib/models/SmallOffice";
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db/connectDB";
// import User from "@/lib/models/userSchema";

// export async function GET(req) {
//     try {
//         const response = await authMiddleware(req);
//         if (response) return response;

//         const { _id: userId } = req.user;
        
//         const { searchParams } = new URL(req.url);
//         const style = searchParams.get("style");

//         await connectDB();

//         // Find user's office_id
//         const user = await User.findById(userId);
//         if (!user || !user.office_id) {
//             return NextResponse.json({ success: false, message: "User or office not found" }, { status: 404 });
//         }

//         // Fetch office details and populate guest item references
//         const office = await SmallOffice.findById(user.office_id).populate("guest_items.item");
//         if (!office) {
//             return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
//         }
        
//         let additionalItems;
        
//         if (style === "order") {
//             // Send all additional orders if style is "order"
//             additionalItems = office.additional_items;
//         } else {
//             // Extract additional items for the specific user
//             additionalItems = office.additional_items[userId] || {};
//         }

        
        
//         // Format guest orders properly
//         const guestItems = office.guest_items.map((guestItem) => ({
//             item: guestItem.item._id,
//             name: guestItem.item.name, // Populated item name
//             price: guestItem.price,
//             quantity: guestItem.quantity,
//             addedBy: guestItem.addedBy
//         }));

//         return NextResponse.json({
//             success: true,
//             message: "Fetch success",
//             additionalItems,  
//             guest_items: guestItems             
//         }, { status: 200 });

//     } catch (err) {
//         console.log(err);
//         return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
//     }
// }
