import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdditionalMenu from "@/lib/models/AdditionalMenu";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import Menu from "@/lib/models/Menu";

export async function POST(req) {
    try {
        await connectDB();

        // Authenticate the user
        const response = await authMiddleware(req);
        if (response) return response;

        // Extract user details
        const { _id: restOwnerId, role } = req.user;
        if (role !== "restaurant_owner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Extract data from request
        const { regularItem, additionalMenu } = await req.json();

        // Get office_id from user
        const { office_id } = await User.findById(restOwnerId);
        if (!office_id) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        // Fetch existing menu if it exists
        let existingMenu = await Menu.findOne({ office_id });

        // Ensure regularItem is converted to a plain object
        const regularItemPlain = Object.fromEntries(
            Object.entries(regularItem).map(([day, items]) => [day, { ...items }])
        );

        // Handle additional menu items (create & get IDs)
        const additionalMenuItems = await AdditionalMenu.insertMany(
            additionalMenu.map(item => ({
                ...item,
                createdBy: restOwnerId,
                updatedBy: restOwnerId,
            }))
        );
        const additionalMenuIds = additionalMenuItems.map(item => item._id);

        if (existingMenu) {
            // Merge regularItem updates without overwriting other days
            existingMenu.regularItem = { 
                ...existingMenu.regularItem.toObject(),  // Convert existing map to object
                ...regularItemPlain  // Merge new data
            };

            // Append new additional menu items
            existingMenu.additionalMenu.push(...additionalMenuIds);
            existingMenu.updatedBy = restOwnerId;

            await existingMenu.save();
            return NextResponse.json({ success: true, message: "Menu updated successfully", menu: existingMenu }, { status: 200 });
        }

        // If no existing menu, create a new one
        const newMenu = new Menu({
            office_id,
            regularItem: regularItemPlain,  // Store it as a plain object
            additionalMenu: additionalMenuIds,
            createdBy: restOwnerId,
            updatedBy: restOwnerId,
        });

        await newMenu.save();
        return NextResponse.json({ success: true, message: "Menu created successfully", menu: newMenu }, { status: 201 });

    } catch (err) {
        console.error("Error during menu registration:", err);
        return NextResponse.json({ success: false, message: "Error during registering menu" }, { status: 500 });
    }
}
