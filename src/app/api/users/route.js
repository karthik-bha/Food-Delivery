// pages/api/users/get.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";


//get all users
export async function GET(req) {
    await connectDB();
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return NextResponse.json({ message: "No users found" },{ status: 404 });
        }

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


// delete all users (for testing only)
export async function DELETE(req){
    try{
        await connectDB();
        const users = await User.deleteMany({});
        return NextResponse.json({success:true,data:users});
    }catch{
        return NextResponse.json({success:false});
    }   
}
