import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import Order from "@/lib/models/Order";
import User from "@/lib/models/userSchema";
import AdditionalMenu from "@/lib/models/AdditionalMenu"; // Import AdditionalMenu model
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";

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
        const { NumberOfVeg = 0, NumberOfNonVeg = 0, AdditionalOrder = [], GuestOrder = [], orderStyle } = await req.json();

        if (!NumberOfVeg && !NumberOfNonVeg && !AdditionalOrder.length && !GuestOrder.length) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }

        await connectDB();

        // Find Mapping for Office
        const user = await User.findById(officeAdminId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 400 });
        }

        const mapping = await OfficeAndRestaurantMapping.findOne({ office_id: user.office_id });
        if (!mapping) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }

        let order = null;

        if (orderStyle === "quick") {
            order = new Order({
                OfficeAndRestaurantMappingId: mapping._id,
                NumberOfVeg,
                NumberOfNonVeg,
                TotalAmount: (NumberOfVeg * 100) + (NumberOfNonVeg * 150),
            });
        } else if (orderStyle === "regular") {
            // Fetch Additional Order Details with Prices
            const additionalOrderData = await Promise.all(
                AdditionalOrder.map(async (item) => {
                    const menuItem = await AdditionalMenu.findById(item.item);
                    return {
                        item: item.item,
                        quantity: item.quantity,
                        price: menuItem ? menuItem.price : 0, // Fetch price dynamically
                        totalPrice: menuItem ? item.quantity * menuItem.price : 0,
                    };
                })
            );

            // Fetch Guest Order Details with Prices
            const guestOrderData = await Promise.all(
                GuestOrder.map(async (item) => {
                    const menuItem = await AdditionalMenu.findById(item.item);
                    return {
                        item: item.item,
                        quantity: item.quantity,
                        price: menuItem ? menuItem.price : 0,
                        totalPrice: menuItem ? item.quantity * menuItem.price : 0,
                    };
                })
            );

            // Calculate Total Amount
            const totalAdditionalCost = additionalOrderData.reduce((acc, item) => acc + item.totalPrice, 0);
            const totalGuestCost = guestOrderData.reduce((acc, item) => acc + item.totalPrice, 0);
            const totalAmount = (NumberOfVeg * 100) + (NumberOfNonVeg * 150) + totalAdditionalCost + totalGuestCost;

            // Create Order Object
            order = new Order({
                OfficeAndRestaurantMappingId: mapping._id,
                NumberOfVeg,
                NumberOfNonVeg,
                AdditionalOrder: additionalOrderData,
                GuestOrder: guestOrderData,
                TotalAmount: totalAmount,
            });
            
        }

        if (!order) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }

        await order.save();

        // Clear additional_items after order is placed
        await SmallOffice.findByIdAndUpdate(user.office_id, { additional_items: [] });

        return NextResponse.json({ success: true, message: "Order placed successfully", order }, { status: 200 });

    } catch (err) {
        console.error("Order Placement Error:", err);
        return NextResponse.json({ success: false, message: "Failed to place order" }, { status: 500 });
    }
}
