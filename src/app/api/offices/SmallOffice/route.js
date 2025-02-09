import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";

// This api creates a  new office and assigns the office_id to office_admin
// It also assigns the office_id to the office_admin using the JWT token for authentication

export async function POST(req) {

    // Apply the authentication middleware
    const response = await authMiddleware(req);
    
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }

    // Assign _id after decoding
    console.log(req.user);
    const { _id: officeAdminId, role } = req.user;

    // Check if the user has the right role (office_admin)
    if (role !== "office_admin") {
        return NextResponse.json({ success: false, message: "Only office admins can create offices" }, { status: 403 });
    }

    // Extract details from request body
    const { name, email, phone, state, district, street_address } = await req.json();
    
    // Check for missing fields
    if (!name || !email || !phone || !state || !district || !street_address) {
        return NextResponse.json({ success: false, message: "Name, Email, Phone, State, District and Street address are required" }, { status: 400 });
    }
    
    try {
        await connectDB();
        // Check if the office admin already has an office assigned
        const officeExists = await User.findOne({ _id: officeAdminId, office_id: { $ne: null } }); //$ne is not equal to
        if (officeExists) {
            return NextResponse.json({ success: false, message: "Cannot add more than 1 office" }, { status: 400 });
        }

        // Create a new office with the new location and return object
        const newOffice = await SmallOffice.create({
            name,
            state,
            district,
            street_address,
            phone, 
            email,
            createdBy: officeAdminId,
        });

        // Check if office admin exists (edge case)
        const officeAdmin = await User.findById(officeAdminId);
        if (!officeAdmin) {
            return NextResponse.json({ success: false, message: "Office admin not found" }, { status: 404 });
        }

        // Assign the new office ID to the office admin
        await User.updateOne(
            { _id: officeAdminId }, // Finds the office admin by their user ID
            { office_id: newOffice._id } // Updates their office_id field
        );

        return NextResponse.json({ success: true, message: "Small Office created successfully", data: newOffice }, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during office creation" }, { status: 500 });
    }
}
export async function GET(req) {
   
    try {
        await connectDB();
        const offices = await SmallOffice.find({});
        return NextResponse.json({ success: true, data: offices });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}