import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import AdminOffice from "@/lib/models/AdminOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import SmallOffice from "@/lib/models/SmallOffice";

// This api creates a  new office and assigns the office_id to office_admin
// It also assigns the office_id to the admin using the JWT token for authentication

export async function POST(req) {

    // Apply the authentication middleware
    const response = await authMiddleware(req);

    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }

    // Assign _id after decoding
    console.log(req.user);
    const { _id: AdminId, role } = req.user;

    // Check if the user has the right role (office_admin)
    if (role !== "admin" && role !== "super_admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Extract details from request body
    const { name, email, phone, state, district, street_address } = await req.json();

    // Check for missing fields
    if (!name || !email || !phone || !state || !district || !street_address) {
        return NextResponse.json({ success: false, message: "Name, Email, Phone, State, District and Street address are required" }, { status: 400 });
    }

    try {
        await connectDB();

        // Check if the email already exists in any schema
        const existingUser = await User.findOne({ email }) ||
            await AdminOffice.findOne({ email }) ||
            await RestaurantOffice.findOne({ email }) ||
            await SmallOffice.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 409 }
            );
        }
        // console.log(
        //     {
        //             name,
        //             state,
        //             district,
        //             street_address,
        //             phone,
        //             email,
        //             createdBy: AdminId,
        //         }
        // )
        // Create a new office with the new location and return object
        const newOffice = await AdminOffice.create({
            name,
            state,
            district,
            street_address,
            phone,
            email,
            createdBy: AdminId,
        });


        return NextResponse.json({ success: true, message: "Admin office created successfully" , newOffice }, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during office creation" }, { status: 500 });
    }
}
export async function GET(req) {

    try {
        await connectDB();
        const offices = await AdminOffice.find({});
        return NextResponse.json({ success: true, data: offices });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}