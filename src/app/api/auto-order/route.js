import { connectDB } from "@/lib/db/connectDB";
import Order from "@/lib/models/Order";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import Menu from "@/lib/models/Menu";

export async function POST(req) {
    try {
        await connectDB();
        const { restaurantId } = await req.json();
        if (!restaurantId) {
            return NextResponse.json({ success: false, message: "Restaurant ID is required" }, { status: 400 });
        }

        const hardcodedOrderTime = new Date();
        console.log(hardcodedOrderTime.getDay());
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

            // Check if mapping exists and if it is active
            const activeMapping = await OfficeAndRestaurantMapping.findOne({ office_id: mapping.office_id, isActive: true });
            if (!activeMapping) {
                // return NextResponse.json({ success: false, message: "Active Mapping not found" }, { status: 400 })
                console.log(`Skipping office ${mapping.office_id} (Mapping Inactive)`);
                continue;
            };

            // Check if the restaurant is active
            const restOffice = await RestaurantOffice.findById(mapping.restaurant_id);
            if (!restOffice || !restOffice.isActive) {
                console.log(`Skipping restaurant ${mapping.restaurant_id} (Inactive)`);
                continue;
            }

            // Additional check : Check if menu has today's regular item
            const menu = await Menu.findOne({ office_id: mapping.restaurant_id });
            // console.log(menu);
            // console.log(menu.regularItem.get(daysOfWeek[hardcodedOrderTime.getDay()]));
            if (!menu || menu.regularItem.size === 0 || menu.regularItem.get(daysOfWeek[hardcodedOrderTime.getDay()]) === undefined) {
                console.log(`Skipping office ${mapping.office_id} (No menu for today)`);
                continue;
                // return NextResponse.json({ success: false, message: "No Menu Present for today, cannot place order" }, { status: 400 });               
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

            // // Do not place order if no users are opt out of regular meals
            // if(numberOfNonVeg===0 && numberOfVeg===0) {
            //     return NextResponse.json({success:false, message:"No Users in office, cannot place order"}, {status:400});
            // }

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

            // Calculating Total Amount (hardcoded meal price for now)
            const totalAmount = numberOfVeg * 100 + numberOfNonVeg * 150 + totalAdditionalCost + totalGuestCost;


            if (totalAmount === 0) {
                return NextResponse.json({ success: false, message: "No orders to place" }, { status: 400 });
            }

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
