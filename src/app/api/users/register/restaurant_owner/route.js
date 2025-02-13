import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db/connectDB";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(request) {
    try {
        await connectDB(); // Connect to DB first before any operations
        
        const { name, phone, email, password } = await request.json();
        
        // Validate input fields
        if (!email || !password || !name || !phone) {
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
                RestaurantOffice.findOne({email}),
                SmallOffice.findOne({ email })
            ]);

            if (user || adminOffice ||  restOffice || smallOffice) {
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
            password: hashedPassword,
            phone,
            role: "restaurant_owner",
            office_id: null,
            office_type: 2,
        });

        await newRestaurantOwner.save();

        return NextResponse.json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}