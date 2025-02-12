import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function DELETE(req,{params}) {
    const {staffId}=await params;
    try{
        const response=await authMiddleware(req);
        
        if(response){
            return response;
        }

        const{_id:officeAdminId, role}=req.user;
        
        // Only office admin allowed to delete staff
        if(role!=="office_admin"){
            return NextResponse.json({success:false, message:"Unauthorized"}, {status:403});
        }
        await connectDB();
        // Check if office admin exists
        const adminExists=await User.findById(officeAdminId);
        if(!adminExists) return NextResponse.json({success:false, message:"Office admin doesn't exist"}, {status:403});
        
        // Check if office staff exists
        const officeStaff=await User.findById(staffId);
        if(!officeStaff) return NextResponse.json({success:false, message:"Staff already deleted"}, {status:404});

        const deletedOfficeStaff=await User.findByIdAndDelete(staffId);
        return NextResponse.json({success:true, message:"Deletion successful", deletedOfficeStaff}, {status:200});


    }catch(err){
        console.log(err);
        return NextResponse.json({success:false, message:"Error during deletion"}, {status:403});
    }
    
}