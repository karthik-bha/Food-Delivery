import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";

// Fetches exclusive office related to office admin, Also fetches SmallOffice data for admin and superadmin
export async function GET(req) {
    try {
        // Apply authentication middleware
        const response = await authMiddleware(req);
        if (response) return response;

        console.log(req.user);
        const { _id: userId, role } = req.user;
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not available" }, { status: 400 });
        }

        await connectDB();


        // Return all smalloffices for superadmin
        if (role === "super_admin") {
            const offices = await SmallOffice.find({});
            return NextResponse.json({ success: true, message: "Fetch Success", offices }, { status: 200 });
        }

        // Migrated code from a previous route
        if (role === "admin") {
            // Return filtered smalloffices
            const { office_id } = await User.findById(userId);
            const { state, district } = await AdminOffice.findById(office_id);
            const offices = await SmallOffice.find({ state: state, district: district });
            return NextResponse.json({ success: true, message: "Fetch Success", offices }, { status: 200 });
        }

        // Get the office_id of the logged-in user
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "Office not found" }, { status: 404 });
        }

        const { office_id } = user;

        // Fetch office details
        const officeData = await SmallOffice.findById(office_id);
        if (!officeData) {
            return NextResponse.json({ success: false, message: "Office data not found" }, { status: 404 });
        }

        // Fetch all staff members related to the office
        const staffDetails = await User.find({ office_id, role: { $in: ["office_staff", "office_admin"] } });

        // Calculate staff statistics
        const totalStaff = staffDetails.length;
        const vegCount = staffDetails.filter(staff => staff.isVeg).length;
        const nonVegCount = totalStaff - vegCount;

        // Auto calculate regular meals (only active staff and not excluded from regular meals) 
        const totalMeals = staffDetails.filter(staff => staff.isActive && staff.excludeMeal === false).length;
        const vegMeals = staffDetails.filter(staff => staff.isVeg && staff.isActive && staff.excludeMeal === false).length;
        const nonVegMeals = totalMeals - vegMeals;

        // Calculate additional items and price
        const additionalItems = officeData.additional_items;
        let totalAdditionalItems = 0;
        let totalAdditionalItemsPrice = 0;

        for (let userId in additionalItems) {
            for (let itemId in additionalItems[userId]) {
                let quantityOfCurrentItem = additionalItems[userId][itemId].quantity;
                let priceOfCurrentItem = additionalItems[userId][itemId].price
                totalAdditionalItems += quantityOfCurrentItem
                totalAdditionalItemsPrice += priceOfCurrentItem * quantityOfCurrentItem;
            }

        }


        return NextResponse.json({
            success: true,
            message: "Fetch Success",
            officeData,
            staffStats: {
                totalStaff,
                vegCount,
                nonVegCount,
                totalMeals,
                vegMeals,
                nonVegMeals,
                totalAdditionalItems,
                totalAdditionalItemsPrice
            }
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}

