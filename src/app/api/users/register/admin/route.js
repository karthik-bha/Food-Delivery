import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import bcrypt from "bcrypt"
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(req) {

    // Apply the authentication middleware
    const response = await authMiddleware(req);
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }  

    // Access the user data attached by the middleware
    const { _id: superAdminId, role } = req.user;

    // Check if the user has the right role (super_admin)
    if (role !== "super_admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Extract email and password from request body
    const { email, password, name, phone, office_id } = await req.json();
    if (!email || !password || !name || !phone || !office_id) {
        return NextResponse.json({ success: false, message: "Email, Name, Phone, Password and office are required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if super admin exists
        const superAdmin = await User.findById(superAdminId);
        if (!superAdmin || superAdmin.role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Invalid super admin" }, { status: 403 });
        }

        // Check if user exists in any collection using Promise.all
        try {
            const [user, adminOffice, restOffice, smallOffice] = await Promise.all([

                User.findOne({ email }),
                AdminOffice.findOne({ email }),
                SmallOffice.findOne({ email }),
                RestaurantOffice.findOne({ email }),
            ]);

            if (user || adminOffice || restOffice || smallOffice) {
                return NextResponse.json(
                    { success: false, message: "Email already exists" },
                    { status: 409 }
                );
            }
        } catch (error) {
            console.error("Error checking existing users:", error);
            return NextResponse.json(
                { success: false, message: "Error checking user existence" },
                { status: 500 }
            );
        }

        // Ensure that an admin is assigned to a location
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = new User({
            name,
            office_id,
            phone,
            email,
            password: hashedPassword,
            role: "admin",
            office_type: 1,
            createdBy: superAdminId,
        });

        await adminUser.save();

        return NextResponse.json({
            success: true,
            message: "Admin Registered Successfully",
            newUser: adminUser,
        }, { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }

}
