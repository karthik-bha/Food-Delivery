import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";


export async function PUT(req, { params }) {

    const { editId } = await params;

    // Authenticate the user
    const response = await authMiddleware(req);

    if (response) return response; // If auth fails, return response

    const { _id: userId, role } = req.user;

    const { office_id, isActive, isVeg, name, email, phone, excludeMeal, type } = await req.json();

    // Reject empty requests
    if (!name && !email && !phone && isVeg === undefined && isActive === undefined) {
        return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
    }

    // Check if id was given
    if (!editId) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const userToBeEdited = await User.findById(editId);

    try {
        await connectDB();

        let updatedUser;
        if (role === "admin") {
            
            if (!email || !name || !phone || !office_id) {
                return NextResponse.json({ success: false, message: "Email, Name, Phone and Office are required" }, 
                    { status: 400 });
            }
            
            // Updates partial details of office admins
            updatedUser = await User.findByIdAndUpdate(
                editId,
                { name, email, phone, office_id, updatedBy: userId },
                { new: true }
            );
            
        }

        // Edit full details of office admin, staff and restaurant owner
        else if (role === "office_admin" || role === "restaurant_owner") {
            
            // Update the selected
            if (type === "officeUsers") {
                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { isVeg, isActive, excludeMeal, updatedBy: userId },
                    { new: true }
                );
            } else {
                // Reject empty requests
                if (!name || !email || !phone || isVeg === undefined && isActive === undefined) {
                    return NextResponse.json({ success: false, message: "Fields cannot be empty!" }, { status: 400 });
                }

                // Updates office staff full details
                updatedUser = await User.findByIdAndUpdate(
                    editId,
                    { name, email, phone, office_id, isVeg, isActive, excludeMeal, updatedBy: userId },
                    { new: true }
                );
            }
        }

        // Edit partial details of staff (lower privileges)
        else if (role === "office_staff") {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { isVeg, isActive, excludeMeal, updatedBy: userId },
                { new: true }
            );
        }

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User details updated successfully", updatedUser });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Error" });
    }
}
