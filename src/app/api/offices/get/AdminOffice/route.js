import { connectDB } from "@/lib/db/connectDB";
import { authMiddleware } from "@/lib/middleware/auth";
import AdminOffice from "@/lib/models/AdminOffice";
import { NextResponse } from "next/server";

export async function GET(request) {
    const response = await authMiddleware(request);
    if (response) return response;

    try {
        await connectDB();
        const adminOffices = await AdminOffice.find({});
        return NextResponse.json({ success: true, message: "Fetch Success", adminOffices }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error during fetch" }, { status: 500 });
    }
}