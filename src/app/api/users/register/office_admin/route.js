import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middleware/auth";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(req) {
    try {
        const response = await authMiddleware(req);
        if (response) {
            return response;
        }

        const { _id: adminId, role } = req.user;
        
        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Only admins can add office_admin" }, 
                { status: 403 }
            );
        }

        await connectDB();

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Invalid admin" }, 
                { status: 403 }
            );
        }

        const { name, phone, email, password, office_id } = await req.json();

        if (!email || !password || !name || !phone || !office_id) {
            return NextResponse.json(
                { success: false, message: "Email, Name, Phone, Password and Office are required" }, 
                { status: 400 }
            );
        }

        const [user, adminOffice, restOffice, smallOffice] = await Promise.all([
            User.findOne({ email }),
            AdminOffice.findOne({ email }),
            RestaurantOffice.findOne({email}),
            SmallOffice.findOne({ email })
        ]);

        if (user || adminOffice ||  restOffice || smallOffice) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const officeAdminUser = new User({
            name,
            email,
            office_id,
            password: hashedPassword,
            phone,
            role: "office_admin",
            office_type: 3,
            createdBy: adminId,
        });

        await officeAdminUser.save();

        return NextResponse.json({
            message: "Office Admin Registered Successfully",
            newUser: officeAdminUser,
            success:true,
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Server error" }, 
            { status: 500 }
        );
    }
}