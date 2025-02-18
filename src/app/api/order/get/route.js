import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
    try{
        const orders = await Order.find({});
        return NextResponse.json({success:true, orders}, {status:200});
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false, message:"Error during fetch"}, {status:500});
    }
}