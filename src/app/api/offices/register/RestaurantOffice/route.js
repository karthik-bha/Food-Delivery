import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import { connectDB } from "@/lib/db/connectDB";

export async function POST(req) {

    // Apply the authentication middleware
    const response = await authMiddleware(req);

    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }

    // Assign _id after decoding
    console.log(req.user);
    const { _id: restOwnerId, role } = req.user;

    if (role !== "restaurant_owner") {
        return NextResponse.json({ success: false, message: "Only restaurant owners can create offices" }, { status: 403 });
    }

    // Extract details from request body
    const { name, email, phone, state, district, street_address, timeLimit } = await req.json();

    // Check for missing fields
    if (!name || !email || !phone || !state || !district || !street_address || timeLimit) {
        return NextResponse.json({ success: false, message: "Name, Email, Phone, State, District , Street address and timeLimit are required" }, { status: 400 });
    }

    // Validate timeLimit format (HH:MM, 24-hour format)
    if (timeLimit && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeLimit)) {
        return NextResponse.json({ success: false, message: "Invalid timeLimit format. Use HH:MM (24-hour format)." }, 
            { status: 400 });
    }
    
    try {
        await connectDB();
        try {
            const [user, adminOffice, restOffice, smallOffice] = await Promise.all([

                User.findOne({ email }),
                AdminOffice.findOne({ email }),
                RestaurantOffice.findOne({ email }),
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

        // After verifying email is unqiue proceed
        const newOffice = new RestaurantOffice({
            name,
            email,
            phone,
            state,
            district,
            street_address,
            createdBy: restOwnerId,
        });
        const {_id}=await newOffice.save();
        await User.findByIdAndUpdate(restOwnerId, { office_id: _id });
        return NextResponse.json({ success: true, message: "Restaurant Office created successfully" }, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error creating office" }, { status: 500 });
    }
}