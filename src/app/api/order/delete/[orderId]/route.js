import { connectDB } from "@/lib/db/connectDB";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {
    const {orderId} = await params;
    try{
        await connectDB();
        await Order.findByIdAndDelete(orderId);
        return NextResponse.json({success:true, message:"Order deleted successfully"}, {status:200});
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false, message:"Failed to delete order"}, {status:500});
    }
}