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

 
    console.log(req.user);

    const { _id: adminId, role } = req.user; // ID of admin registering the office   
    
    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Extract district and state of admin
    const adminData = await User.findById(adminId).populate("office_id");
    if (!adminData.office_id) {
        return NextResponse.json({ success: false, message: "No admin office found" }, { status: 404 });
    }

    const adminOffice = adminData.office_id;
    const { district, state } = adminOffice;

    // Extract details from request body
    let { name, email, phone, street_address, timeLimit } = await req.json();

    // Check for missing fields
    if (!name || !email || !phone || !street_address || !timeLimit) {
        return NextResponse.json(
            { success: false, message: "Name, Email, Phone, Street address, and timeLimit are required" },
            { status: 400 }
        );
    }

    // Checking if given timeLimit is valid or not
    if (timeLimit) {
        if (!/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(timeLimit)) {
            return NextResponse.json({ success: false, message: "Invalid timeLimit format. Use this format (HH:MM AM/PM) eg: 07:00 AM." },
                { status: 400 });
        }
        // Converting user time to 24-hour format
        const [time, period] = timeLimit.split(" "); // Separate time and AM/PM
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0; // Handle midnight

        timeLimit = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        console.log(timeLimit);
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
        //     timeLimit,
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
        await newOffice.save();

        return NextResponse.json({ success: true, message: "Restaurant Office created successfully" , newOffice}, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error creating office" }, { status: 500 });
    }
}
