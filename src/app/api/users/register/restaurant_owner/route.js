import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db/connectDB";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import { authMiddleware } from "@/lib/middleware/auth";
export async function POST(req) {
    
    const response = await authMiddleware(req);
    if(response) return response;

    const {_id:adminId, role} = req.user;

    if(role!=="admin"){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    try {
        await connectDB(); 
        const { name, phone, email, password, office_id} = await req.json();

        // Validate input fields
        if (!email || !password || !name || !phone || !office_id) {
            return NextResponse.json(
                { success: false, message: "Email, Name, Phone, and Password are required" },
                { status: 400 }
            );
        }

        // Check if user exists in any collection using Promise.all
        try {
            const [user, adminOffice, restOffice, smallOffice] = await Promise.all([

                User.findOne({ email }),
                AdminOffice.findOne({ email }),
                RestaurantOffice.findOne({ email }),
                SmallOffice.findOne({ email })
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

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newRestaurantOwner = new User({
            name,
            email,
            office_id,
            password: hashedPassword,
            phone,
            role: "restaurant_owner",    
            office_type: 2,
            createdBy: adminId,
        });

        await newRestaurantOwner.save();

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            newUser: newRestaurantOwner
        }, { status: 201 });

    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}