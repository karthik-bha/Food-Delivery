import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await connectDB();
        const mapping = await OfficeAndRestaurantMapping.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Mapping deleted successfully", mapping });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}