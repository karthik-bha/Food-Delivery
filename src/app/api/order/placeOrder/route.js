import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import Order from "@/lib/models/Order";
import User from "@/lib/models/userSchema";
import AdditionalMenu from "@/lib/models/AdditionalMenu";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(req) {
    try {
        // Authentication Middleware
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: officeAdminId, role } = req.user;
        if (role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Parse Request Data
        const { NumberOfVeg = 0, NumberOfNonVeg = 0, AdditionalOrder = [], GuestOrder = [] } = await req.json();
        if (!NumberOfVeg && !NumberOfNonVeg && !AdditionalOrder.length && !GuestOrder.length) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }

        await connectDB();

        // Get Office Mapping
        const user = await User.findById(officeAdminId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 400 });

        // Checks to see if order is possible (smalloffice must be open, restuarantoffice must be open)
        const smallOffice = await SmallOffice.findById(user.office_id);
        if (!smallOffice.isActive) {
            return NextResponse.json({
                success: false,
                message: "Your office is closed, cannot place order."
            },
                { status: 400 });
        }

        

        const mapping = await OfficeAndRestaurantMapping.findOne({ office_id: user.office_id });
        if (!mapping) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });

        // Check if restaurant is active
        const restaurantOffice = await RestaurantOffice.findById(mapping.restaurant_id);
        if (!restaurantOffice.isActive) {
            return NextResponse.json({
                success: false,
                message: "Cannot place order, Restaurant is closed!"
            },
                { status: 400 });
        }
        

        // Function to process orders
        const processOrders = async (orders) => {
            return await Promise.all(
                orders.map(async (group) => {
                    const items = await Promise.all(
                        group.items.map(async (item) => {
                            const menuItem = await AdditionalMenu.findById(item.item);
                            if (!menuItem) {
                                throw new Error(`Menu item not found: ${item.item}`);
                            }
                            return {
                                item: item.item,
                                quantity: item.quantity || 1,
                                totalPrice: item.quantity * menuItem.price || 0,
                            };
                        })
                    );
                    return { orderedBy: group.orderedBy, items };
                })
            );
        };

        // Process Additional and Guest Orders
        const formattedAdditionalOrder = await processOrders(AdditionalOrder);
        const formattedGuestOrder = await processOrders(GuestOrder);

        // Calculate Total Cost
        const totalAdditionalCost = formattedAdditionalOrder.reduce(
            (acc, group) => acc + group.items.reduce((sum, item) => sum + item.totalPrice, 0),
            0
        );
        const totalGuestCost = formattedGuestOrder.reduce(
            (acc, group) => acc + group.items.reduce((sum, item) => sum + item.totalPrice, 0),
            0
        );
        const totalAmount = (NumberOfVeg * 100) + (NumberOfNonVeg * 150) + totalAdditionalCost + totalGuestCost;

        // Create and Save Order
        const order = new Order({
            OfficeAndRestaurantMappingId: mapping._id,
            NumberOfVeg,
            NumberOfNonVeg,
            AdditionalOrder: formattedAdditionalOrder,
            GuestOrder: formattedGuestOrder,
            TotalAmount: totalAmount,
        });

        // await order.save();

        // Clear additional items after order placement
        // await SmallOffice.findByIdAndUpdate(user.office_id, { additional_items: {}, guest_items: [] });


        return NextResponse.json({ success: true, message: "Order placed successfully", order }, { status: 200 });

    } catch (err) {
        console.error("Order Placement Error:", err);
        return NextResponse.json({ success: false, message: err.message || "Failed to place order" }, { status: 500 });
    }
}
