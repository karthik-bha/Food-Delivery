import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";
import { NextResponse } from "next/server";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import { connectDB } from "@/lib/db/connectDB";

export async function POST(req, { params }) {
    // Apply the authentication middleware
    const response = await authMiddleware(req);
    if (response) return response; // Stop execution if unauthenticated

    await connectDB(); // Ensure DB connection before queries

    console.log(req.user);

    const { _id: adminId, role } = req.user; // ID of admin registering the office
    const { linkedUserId: restOwnerId } = await params; // ID of restaurant owner

    // Extract district and state of admin
    const adminData = await User.findById(adminId).populate("office_id");
    if (!adminData.office_id) {
        return NextResponse.json({ success: false, message: "No admin office found" }, { status: 404 });
    }

    const adminOffice = adminData.office_id;
    const { district, state } = adminOffice;

    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Extract details from request body
    const { name, email, phone, street_address, timeLimit } = await req.json();

    // Check for missing fields
    if (!name || !email || !phone || !street_address || !timeLimit) {
        return NextResponse.json(
            { success: false, message: "Name, Email, Phone, Street address, and timeLimit are required" }, 
            { status: 400 }
        );
    }

    // Validate timeLimit format (HH:MM, 24-hour format)
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeLimit)) {
        return NextResponse.json(
            { success: false, message: "Invalid timeLimit format. Use HH:MM (24-hour format)." },
            { status: 400 }
        );
    }

    try {
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

        // console.log({
        //     name,
        //     email,
        //     phone,
        //     state,
        //     district,
        //     street_address,
        //     createdBy: adminId,
        // });

        // Proceed with office creation
        const newOffice = new RestaurantOffice({
            name,
            email,
            phone,
            state,
            district,
            street_address,
            timeLimit,
            createdBy: adminId,
        });
        const { _id } = await newOffice.save();
        await User.findByIdAndUpdate(restOwnerId, { office_id: _id });

        return NextResponse.json({ success: true, message: "Restaurant Office created successfully" }, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error creating office" }, { status: 500 });
    }
}
