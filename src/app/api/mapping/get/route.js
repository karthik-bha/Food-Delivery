import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const mappings = await OfficeAndRestaurantMapping.find({});
        return NextResponse.json({ success: true, data: mappings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}