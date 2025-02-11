import User from "@/lib/models/userSchema";
import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import SmallOffice from "@/lib/models/SmallOffice";
import AdminOffice from "@/lib/models/AdminOffice";

// Delete a specific office admin, their staff, and office
export async function DELETE(req, {params}) {
    const {id} = await params;
    
    try {
        await connectDB();
        const userExists=await User.findById(id);
        if(!userExists){
            return NextResponse.json({success:false,message:"User not found"},{status:404});
        }
        // We will delete the user and office only if user is office_admin or admin as they control office
        if(userExists.role!=="super_admin" && userExists.role!=="office_staff"  ){
            if(userExists.role==="office_admin"){
                const office=await SmallOffice.findOne({_id:userExists.office_id});
                if(!office){
                    console.log(userExists.office_id);
                    return NextResponse.json({success:false,message:"Office not found"},{status:404});
                }
                await User.findByIdAndDelete(userExists._id);
                await User.deleteMany({office_id:office._id});
                await SmallOffice.findByIdAndDelete(office._id);
                return NextResponse.json({success:true,message:"Office Admin, Office Staff and Office deleted successfully"});
            }else if(userExists.role==="admin"){
                await User.findByIdAndDelete(userExists._id);
                await AdminOffice.findByIdAndDelete(userExists.office_id);    
                return NextResponse.json({success:true,message:"Admin and Admin office deleted successfully"});
            }
        }else{
            await User.findByIdAndDelete(userExists._id);
            return NextResponse.json({success:true,message:"User deleted successfully"});
        }
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false,message:"Server error"},{status:500});
    }
    
}