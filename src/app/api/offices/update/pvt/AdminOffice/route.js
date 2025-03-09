import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        // Apply authentication middleware
        const response = await authMiddleware(req);

        // If authentication fails, return response
        if (response) return response;

        // Extract user details from request
        const { _id: userId, role } = req.user;

        if (role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const { isActive, name, email, phone, street_address, district, state, _id: office_id } = await req.json();

        await connectDB();

        // For editing office details from admin side
        if (role === "super_admin") {

            if (!office_id) {
                return NextResponse.json(
                    { success: false, message: "Office is required" },
                    { status: 400 }
                );
            }

            if (!name || !email || !phone || !street_address || !district || !state) {
                return NextResponse.json(
                    { success: false, message: "Name, Email, Phone, Street address, District and State are required" },
                    { status: 400 }
                );
            }

            const updatedOffice = await AdminOffice.findByIdAndUpdate(office_id, {
                name,     
                email,
                phone,
                street_address,
                district,
                state,
                isActive,
                updatedBy: userId,
            });

            if (!updatedOffice) {
                return NextResponse.json(
                    { success: false, message: "Office not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ success: true, message: "Office updated successfully" }, { status: 200 });
        }


    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error updating office" }, { status: 500 });
    }
}