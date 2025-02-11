import { connectDB } from "@/lib/db/connectDB";
import SmallOffice from "@/lib/models/SmallOffice";
import { NextResponse } from "next/server";
export async function GET(req) {
   
    try {
        await connectDB();
        const offices = await SmallOffice.find({});
        return NextResponse.json({ success: true, data: offices });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}