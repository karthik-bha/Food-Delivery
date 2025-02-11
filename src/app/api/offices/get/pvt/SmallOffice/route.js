import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import User from "@/lib/models/userSchema";
import { authMiddleware } from "@/lib/middleware/auth";

export async function GET(req) {
    try {
        // Apply the authentication middleware
        const response = await authMiddleware(req);

        // If the middleware returns a response (i.e., unauthenticated), stop execution here
        if (response) {
            return response;
        }
        // Assign _id after decoding
        console.log(req.user);
        const { _id: userId } = req.user;
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not available" }, {status:400});
        }
        const { office_id } = await User.findById(userId);
        // Get office details
        const officeData=await SmallOffice.findById(office_id);
        return NextResponse.json({success:true, message:"Fetch Success", officeData}, {status:200});
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch"}, {status:500} );
    }

}
