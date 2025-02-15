import { connectDB } from "@/lib/db/connectDB";
import Menu from "@/lib/models/Menu";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB(); // Ensure database is connected

        const menus = await Menu.find({}); // Fetch all menus

        return NextResponse.json({ success: true, data: menus }, { status: 200 });
    } catch (error) {
        console.error("Error fetching menus:", error);
        return NextResponse.json({ success: false, message: "Error fetching menus" }, { status: 500 });
    }
}
