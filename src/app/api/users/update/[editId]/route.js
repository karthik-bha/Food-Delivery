import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";
import bcrypt from "bcrypt";

export async function PUT(req, { params }) {
    const { editId } = await params;
    const response = await authMiddleware(req);
    if (response) return response; // If auth fails, return response

    const { _id: userId, role } = req.user;
    const { office_id, isActive, isVeg, name, email, phone, excludeMeal, type, password } = await req.json();

    if (!name && !email && !phone && isVeg === undefined && isActive === undefined) {
        return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
    }

    if (!editId) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    try {
        await connectDB();
        const userToBeEdited = await User.findById(editId);
        if (!userToBeEdited) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // If email is provided, check if provided email matches current user's email, if yes continue
        if (email && email !== userToBeEdited.email) {

            // If email is different, check if any other user has same email
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
            }
        }

        let updateData = { name, email, phone, office_id, isVeg, isActive, excludeMeal, updatedBy: userId };

        // If password is provided, hash and add it
        if (password?.trim()) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (role === "admin" || role === "super_admin") {
            if (type === "superAdmin") {
                if (!email || !name || !phone) {
                    return NextResponse.json({ success: false, message: "Email, Name, and Phone are required" }, { status: 400 });
                }
            } else {
                if (!email || !name || !phone || !office_id) {
                    return NextResponse.json({ success: false, message: "Email, Name, Phone and Office are required" }, { status: 400 });
                }
            }
        } else if (role === "office_admin" || role === "restaurant_owner") {
            if (type === "officeUsers") {
                updateData = { isVeg, isActive, excludeMeal, updatedBy: userId };
            } else if (!name || !email || !phone) {
                return NextResponse.json({ success: false, message: "Fields cannot be empty!" }, { status: 400 });
            }
        } else if (role === "office_staff") {
            updateData = { isVeg, isActive, excludeMeal, updatedBy: userId };
        }

        const updatedUser = await User.findByIdAndUpdate(editId, updateData, { new: true }).populate("office_id");

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User details updated successfully", updatedUser });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Error" });
    }
}
