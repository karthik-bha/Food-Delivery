import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import Menu from "@/lib/models/Menu";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        // Authenticate the user
        const response = await authMiddleware(req);
        if (response) return response;

        const { _id: restOwnerId, role } = req.user;
        if (role !== "restaurant_owner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        await connectDB(); // Ensure DB connection
        const { menuId } = await req.json(); // Extract menuId from request body

        // Fetch user's office_id
        const user = await User.findById(restOwnerId);
        console.log(user);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const { office_id } = user;

        // Fetch menu
        const menu = await Menu.findOne({ office_id: office_id });
        console.log(menu);

        if (!menu) {
            return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
        }

        let deleted = false;

        // Ensure regularItem is treated as a Map
        const regularItems = menu.regularItem instanceof Map 
            ? menu.regularItem 
            : new Map(Object.entries(menu.regularItem));

        // Find the day that contains the menuId
        const dayToDelete = [...regularItems.keys()].find(
            (day) => regularItems.get(day)?._id.toString() === menuId
        );

        // If found, delete the regular item
        if (dayToDelete) {
            regularItems.delete(dayToDelete);
            menu.regularItem = Object.fromEntries(regularItems); // Convert back to object for MongoDB
            deleted = true;
        }

        // Delete from additionalMenu if not found in regularItem
        if (!deleted) {
            const index = menu.additionalMenu.findIndex(
                (item) => item._id.toString() === menuId
            );
            if (index !== -1) {
                menu.additionalMenu.splice(index, 1);
                deleted = true;
            }
        }

        if (!deleted) {
            return NextResponse.json({ success: false, message: "Menu item not found" }, { status: 404 });
        }

        // Save the updated menu
        await menu.save();

        return NextResponse.json({ success: true, message: "Menu item deleted successfully" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error deleting menu item" }, { status: 500 });
    }
}
