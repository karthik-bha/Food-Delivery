import { connectDB } from "@/lib/db/connectDB";
import { NextResponse } from "next/server";
import Office from "@/lib/models/officeSchema";


// This endpoint gets ALL offices
export async function GET(req) {
    await connectDB();
    try {
        const offices = await Office.find({});
        return NextResponse.json({ success: true, data: offices });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}