import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";


// Creates small office only
export async function POST(req, {params}) {
 
    // Apply the authentication middleware
    const response = await authMiddleware(req);

    // If the middleware returns a response (i.e., unauthenticated), stop execution here
    if (response) {
        return response;
    }

    const { _id: adminId, role } = req.user;

    // Check if the user has the right role (office_admin)
    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
       

    // We will assign admin office state and district to this office
    const admin = await User.findById(adminId).populate("office_id");
    const adminOffice = admin.office_id;


    if(!adminOffice || !adminOffice.state || !adminOffice.district){
        return NextResponse.json({ success: false, message: "Admin office state and district are required" }, { status: 400 });
    }

    const { state, district } = adminOffice;
    

    // Extract details from request body
    const { name, email, phone,  street_address } = await req.json();

    // Check for missing fields
    if (!name || !email || !phone  || !street_address) {
        return NextResponse.json({ success: false, message: "Name, Email, Phone, State, District and Street address are required" }, 
            { status: 400 }
        );
    }

    try {
        await connectDB();       
        // Check if email already exists in other collections.        
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
        // console.log(
        //     {name,
        //     state,
        //     district,
        //     street_address,
        //     phone,
        //     email,
        //     createdBy: adminId
        // })
        // Create a new office with the new location and return object
        const newOffice = await SmallOffice.create({
            name,
            state,
            district,
            street_address,
            phone,
            email,
            createdBy: adminId,
        });
              
        return NextResponse.json({ success: true, message: "Small Office created successfully", newOffice }, { status: 201 });      

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