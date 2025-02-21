import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import AdminOffice from "@/lib/models/AdminOffice";

export async function GET(req) {
    try {
        await connectDB();

        // Apply authentication middleware
        const response = await authMiddleware(req);
        if (response) return response;

        if (!req.user) {
            return NextResponse.json({ success: false, message: "Unauthorized: No user found" }, { status: 401 });
        }

        const { _id: userId, role } = req.user;

        if (!["restaurant_owner", "office_admin", "admin", "super_admin"].includes(role)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user || !user.office_id) {
            return NextResponse.json({ success: false, message: "No associated office found" }, { status: 404 });
        }

        let officeDetails = null;

        // Super Admin: Fetch all restaurant offices
        if (role === "super_admin") {
            officeDetails = await RestaurantOffice.find({});
            return NextResponse.json({ success: true, message: "Fetch Success", officeDetails }, { status: 200 });
        }

        // Admin: Fetch restaurant offices in the same state & district
        else if (role === "admin") {
            const { office_id } = await User.findById(userId);
            const { state, district } = await AdminOffice.findById(office_id);
            officeDetails = await RestaurantOffice.find({ state: state, district: district }); 
                
        }

        // Restaurant Owner: Fetch their own restaurant office
        else if (role === "restaurant_owner") {
            officeDetails = await RestaurantOffice.findById(user.office_id);
            if (!officeDetails) {
                return NextResponse.json({ success: false, message: "Restaurant not found" }, { status: 404 });
            }
        }

        // Office Admin: Fetch restaurant mapped to their office
        else if (role === "office_admin") {
            const restaurantMapping = await OfficeAndRestaurantMapping.findOne({ office_id: user.office_id });

            if (!restaurantMapping || !restaurantMapping.restaurant_id) {
                return NextResponse.json({ success: false, message: "No restaurant mapped!" }, { status: 404 });
            }

            officeDetails = await RestaurantOffice.findById(restaurantMapping.restaurant_id);
            if (!officeDetails) {
                return NextResponse.json({ success: false, message: "Mapped restaurant not found" }, { status: 404 });
            }
        }

        if (!officeDetails) {
            return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
        }
        
        console.log(officeDetails);  
        return NextResponse.json({ success: true, message: "Fetch Success", officeDetails }, { status: 200 });

    } catch (err) {
        console.error("Error fetching office details:", err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}

