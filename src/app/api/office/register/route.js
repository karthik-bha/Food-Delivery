import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import Office from "@/lib/models/officeSchema";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";

// This api creates a  new office and assigns the office_id to office_admin
// It also assigns the office_id to the office_admin using the JWT token for authentication

export async function POST(req) {

    // Apply the authentication middleware
    const response = authMiddleware(req);
    
    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }

    // Assign _id after decoding
    const { _id: officeAdminId, role } = decoded;

    // Check if the user has the right role (office_admin)
    if (role !== "office_admin") {
        return NextResponse.json({ success: false, message: "Only office admins can create offices" }, { status: 403 });
    }

    // Extract details from request body
    const { name, street, city, pincode } = await req.json();
    
    // Check for missing fields
    if (!name || !street || !city || !pincode) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    
    try {
        await connectDB();
        // Check if the office admin already has an office assigned
        const officeExists = await User.findOne({ _id: officeAdminId, office_id: { $ne: null } }); //$ne is not equal to
        if (officeExists) {
            return NextResponse.json({ success: false, message: "Cannot add more than 1 office" }, { status: 400 });
        }

        // Create a new office with the new location and return object
        const newOffice = await Office.create({
            name,
            location:{
                street,
                city,
                pincode 
            }
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

        return NextResponse.json({ success: true, message: "Office created successfully", data: newOffice }, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during office creation" }, { status: 500 });
    }
}
