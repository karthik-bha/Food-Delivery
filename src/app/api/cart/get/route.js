import { authMiddleware } from "@/lib/middleware/auth";
import SmallOffice from "@/lib/models/SmallOffice";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";


export async function GET(req) {

    try{
        const response = await authMiddleware(req);
        if(response){
            return response;
        }
        const { _id: userId } = req.user;
        await connectDB();
        const {office_id} = await User.findById(userId);
        const office = await SmallOffice.findById(office_id);
        if(!office){
            return NextResponse.json({ success: false, message: "No office found" }, { status: 404 });
        }

        const additionalItems= office.additional_items;

        return NextResponse.json({ success: true, message: "Fetch success", additionalItems }, { status: 200 });

    }catch(err){
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
    
}