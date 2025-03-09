
import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";

export async function POST(req) {

    const response = await authMiddleware(req);
    if (response) return response;

    const { _id: userId, role } = req.user;

    if (role !== "admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { restaurant_id, office_ids } = await req.json();
        console.log(restaurant_id, office_ids)
        if (!restaurant_id || !Array.isArray(office_ids)) {
            return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
        }

        // Fetch existing mappings for this restaurant
        const existingMappings = await OfficeAndRestaurantMapping.find({ restaurant_id });

        // Get currently mapped office IDs
        const existingOfficeIds = existingMappings.map(mapping => mapping.office_id.toString());

        // Offices to be removed (present before but not in new list)
        const officesToRemove = existingOfficeIds.filter(id => !office_ids.includes(id));

        // Offices to be added (not mapped before)
        const officesToAdd = office_ids.filter(id => !existingOfficeIds.includes(id));

        // Validate that the new offices are not already mapped to another restaurant
        const conflictingMappings = await OfficeAndRestaurantMapping.find({
            office_id: { $in: officesToAdd },
            restaurant_id: { $ne: restaurant_id }
        });

        if (conflictingMappings.length > 0) {
            return NextResponse.json({
                success: false,
                message: "Some offices are already mapped to another restaurant"
            }, { status: 400 });
        }

        // Remove old mappings
        if (officesToRemove.length > 0) {
            await OfficeAndRestaurantMapping.deleteMany({
                restaurant_id,
                office_id: { $in: officesToRemove }
            });
        }

        // Add new mappings
        if (officesToAdd.length > 0) {
            const newMappings = officesToAdd.map(officeId => ({
                restaurant_id,
                office_id: officeId,
                isActive: true, // Default to active
                createdBy: userId
            }));

            console.log(newMappings);
            await OfficeAndRestaurantMapping.insertMany(newMappings);
        }

        return NextResponse.json({ success: true, message: "Mappings updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating mappings:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
