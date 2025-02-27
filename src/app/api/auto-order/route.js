import { connectDB } from "@/lib/db/connectDB";
import Order from "@/lib/models/Order";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(req) {
    try {
        await connectDB();
        const { restaurantId } = await req.json(); 
        if (!restaurantId) {
            return NextResponse.json({ success: false, message: "Restaurant ID is required" }, { status: 400 });
        }

        const hardcodedOrderTime = new Date(); 

        // Fetch office-restaurant mappings for this restaurant only
        const mappings = await OfficeAndRestaurantMapping.find({ restaurant_id: restaurantId });

        for (const mapping of mappings) {
            console.log(`Processing mapping: ${mapping._id}`);

            // Fetch the SmallOffice
            const smallOffice = await SmallOffice.findById(mapping.office_id);
            if (!smallOffice || !smallOffice.isActive) {
                console.log(`Skipping office ${mapping.office_id} (Inactive)`);
                continue;
            }

            // Check if the restaurant is active
            const restOffice = await RestaurantOffice.findById(mapping.restaurant_id);
            if (!restOffice || !restOffice.isActive) {
                console.log(`Skipping restaurant ${mapping.restaurant_id} (Inactive)`);
                continue;
            }

            // Processing Users for Meal Counts
            const users = await User.find({ office_id: mapping.office_id, isActive: true });

            let numberOfVeg = 0;
            let numberOfNonVeg = 0;

            users.forEach(user => {
                if (!user.excludeMeal) { 
                    if (user.isVeg) {
                        numberOfVeg++;
                    } else {
                        numberOfNonVeg++;
                    }
                }
            });

            // Processing Additional Orders
            let additionalOrders = [];
            let totalAdditionalCost = 0;

            for (const [userId, items] of Object.entries(smallOffice.additional_items || {})) {
                const userOrders = {
                    orderedBy: userId,
                    items: []
                };

                for (const [itemId, itemData] of Object.entries(items)) {
                    userOrders.items.push({
                        item: itemId,
                        quantity: itemData.quantity,
                        totalPrice: itemData.price * itemData.quantity
                    });

                    totalAdditionalCost += itemData.price * itemData.quantity;
                }

                additionalOrders.push(userOrders);
            }

            // Processing Guest Orders
            let guestOrders = [];
            let totalGuestCost = 0;

            for (const guest of smallOffice.guest_items || []) {
                let guestOrder = guestOrders.find(o => o.orderedBy === guest.addedBy);

                if (!guestOrder) {
                    guestOrder = { orderedBy: guest.addedBy, items: [] };
                    guestOrders.push(guestOrder);
                }

                guestOrder.items.push({
                    item: guest.item,
                    quantity: guest.quantity,
                    totalPrice: guest.price * guest.quantity
                });

                totalGuestCost += guest.price * guest.quantity;
            }

            // Calculating Total Amount
            const totalAmount = numberOfVeg * 100 + numberOfNonVeg * 150 + totalAdditionalCost + totalGuestCost;

            // Create and Save the Order
            const order = new Order({
                OfficeAndRestaurantMappingId: mapping._id,
                OrderDate: hardcodedOrderTime,
                NumberOfVeg: numberOfVeg,
                NumberOfNonVeg: numberOfNonVeg,
                AdditionalOrder: additionalOrders,
                GuestOrder: guestOrders,
                TotalAmount: totalAmount,
            });

            console.log(order);
            await order.save();

            // Clear Additional and Guest Orders
            await SmallOffice.findByIdAndUpdate(smallOffice._id, {
                additional_items: {},
                guest_items: []
            });

            console.log(`Order placed successfully for mapping: ${mapping._id}`);
        }

        return NextResponse.json({ success: true, message: "Auto order placed successfully for restaurant" }, { status: 200 });

    } catch (err) {
        console.error("Auto-order error:", err);
        return NextResponse.json({ success: false, message: err.message || "Auto order failed" }, { status: 500 });
    }
}
