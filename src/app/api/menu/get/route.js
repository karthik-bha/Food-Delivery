import { authMiddleware } from "@/lib/middleware/auth";
import AdditionalMenu from "@/lib/models/AdditionalMenu";
import Menu from "@/lib/models/Menu";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        
        const response = await authMiddleware(req);

        if (response) return response;

        const { _id: restOwnerId, role } = req.user;

        if (role !== "restaurant_owner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const { office_id } = await User.findById(restOwnerId);

        if (!office_id) {
            return NextResponse.json({ success: false, message: "Create an office first!" }, { status: 403 });
        }

        // Fetch menu and populate additionalMenu
        const menuData = await Menu.findOne({ office_id }).populate("additionalMenu");

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
