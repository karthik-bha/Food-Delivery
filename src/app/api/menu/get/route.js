import { authMiddleware } from "@/lib/middleware/auth";
import AdditionalMenu from "@/lib/models/AdditionalMenu";
import Menu from "@/lib/models/Menu";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {

        const response = await authMiddleware(req);

        if (response) return response;

        const { _id: userId, role } = req.user;

        if (role !== "restaurant_owner" && role !== "office_staff" && role !== "office_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Extract office_id irrespective of role (doesnt matter if it is office_staff/office_admin/restaurant_owner)
        const { office_id } = await User.findById(userId);

        if (!office_id) {
            return NextResponse.json({ success: false, message: "Create an office first!" }, { status: 403 });
        }

        let menuData = null;

        // If user is a restaurant owner, fetch menu with additionalMenu directly
        if (role === "restaurant_owner") {
            // Fetch menu and populate additionalMenu
            menuData = await Menu.findOne({ office_id }).populate("additionalMenu");
        }

        // If user is an office staff or admin, fetch menu after getting office_id and then checking restaurant office mapping
        if (role === "office_staff" || role === "office_admin") {
            // We will be finding restaurnant id from mapping
            const { restaurant_id } = await OfficeAndRestaurantMapping.findOne({ office_id });

            if (!restaurant_id) {
                return NextResponse.json({ success: false, message: "No mapping found!" }, { status: 404 });
            }
            
            // Fetch menu and populate additionalMenu
            menuData = await Menu.findOne({ office_id: restaurant_id }).populate("additionalMenu");
        }

        // Check if menu exists
        if (!menuData) {
            return NextResponse.json({ success: false, message: "No menu found!" }, { status: 404 });
        }

        // Structuring the response 
        const structuredMenu = {
            success: true,
            message: "Fetch success",
            menu: {
                office_id: menuData.office_id,
                regularItem: {},
                additionalMenu: menuData.additionalMenu, // Include all additional menu items
            }
        };

        // Loop through regularItem and format it as {Monday: {items}, Tuesday: {items}, ...}
        for (const [day, items] of menuData.regularItem.entries()) {
            structuredMenu.menu.regularItem[day] = items;
        }

        return NextResponse.json(structuredMenu, { status: 200 });

    } catch (err) {
        console.error("Error fetching menu:", err);
        return NextResponse.json({ success: false, message: "Error fetching menu" }, { status: 500 });
    }
}
