import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middleware/auth";

export async function POST(req) {
    // Apply the authentication middleware
    const response = await authMiddleware(req);
    if (response) {
        return response;  
    }

    const { _id: adminId, role } = req.user;

    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Only admins can add office_admin" }, { status: 403 });
    }

    const { name, phone, email, password } = await req.json();

    if (!email || !password || !name || !phone) {
        return NextResponse.json({ success: false, message: "Email, Name, Phone, and Password are required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if the admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ success: false, message: "Invalid admin" }, { status: 403 });
        }

        // Check if email already exists in User collection
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, message: "Email Already Exists in Users" }, { status: 400 });
        }

        // Check if email exists in AdminOffice, RestaurantOffice, or SmallOffice
        const officeExists = await Promise.any([
            AdminOffice.findOne({ email }),
            // RestaurantOffice.findOne({ email }),
            SmallOffice.findOne({ email }),
        ]).catch(() => null); // If all are null, `Promise.any` will reject, so catch it.

        if (officeExists) {
            return NextResponse.json({ success: false, message: "Email Already Exists in Other Offices" }, { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new office_admin user
        const officeAdminUser = new User({
            name,       
            email,
            password: hashedPassword,
            phone,
            role: "office_admin",
            office_type: 3,
            createdBy: adminId,
        });

        await officeAdminUser.save();

        return NextResponse.json({
            message: "Office Admin Registered Successfully, Please Register Your Office and Staff",
            newUser: officeAdminUser,
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
