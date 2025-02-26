import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import User from "@/lib/models/userSchema";
import { connectDB } from "@/lib/db/connectDB";
export async function GET(req) {

    try {

        // Authenticate 
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: userId, role } = req.user;

        await connectDB();

        let orders;

        if (role === "super_admin" || role === "admin") {
            // Return all orders for now
            orders = await Order.find({});
        }
        else if (role === "office_admin" || role === "office_staff") {

            // Get the office id first
            const { office_id } = await User.findById(userId);

            // Using office id get the mapping id             
            const { _id: mappingId } = await OfficeAndRestaurantMapping.findOne({ office_id: office_id });

            // Using the mapping id find the orders
            orders = await Order.find({ OfficeAndRestaurantMappingId: mappingId })
            .populate("AdditionalOrder.orderedBy","name")
            .populate("AdditionalOrder.items.item","name")
            .populate("GuestOrder.orderedBy","name")
            .populate("GuestOrder.items.item","name");

        }
        else if (role === "restaurant_owner") {

            // Get restaurant id from user
            const { office_id: restaurant_id } = await User.findById(userId);
            console.log(restaurant_id);

            // Get all mappings for this restaurant
            const mappings = await OfficeAndRestaurantMapping.find({ restaurant_id: restaurant_id });

            if (mappings.length > 0) {
                // Extract all mapping IDs
                const mappingIds = mappings.map(mapping => mapping._id);

                // Use these mapping IDs to fetch all orders
                orders = await Order.find({ OfficeAndRestaurantMappingId: { $in: mappingIds } })
                .populate({
                    path: "OfficeAndRestaurantMappingId",
                    populate: [
                        { path: "office_id", select: "name" }, 
                        { path: "restaurant_id", select: "name" }
                    ]
                })
                .populate("AdditionalOrder.orderedBy", "name")
                .populate("AdditionalOrder.items.item", "name")
                .populate("GuestOrder.orderedBy", "name")
                .populate("GuestOrder.items.item", "name");

                // console.log("Orders for all mapping IDs: ", orders); 
            } else {
                console.log('No mappings found for this restaurant.');
            }


        }
        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}