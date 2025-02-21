import { authMiddleware } from "@/lib/middleware/auth";
import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {

    const response = await authMiddleware(req);

    if (response) return response;

    const { _id, adminId, role } = req.user;

    if(role!=="admin" && role!=="super_admin"){
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    try {
        
        const { officeAdminId } = await params;

        if (!officeAdminId) {
            return NextResponse.json({ success: false, message: "No user given" }, { status: 400 });
        }

        // Find user's office if it exists

        const { office_id } = await User.findById(officeAdminId);

        let deletedUser;
        
        // Incase we user doesnt have office
        if (office_id === null) {
            deletedUser = await User.findByIdAndDelete(officeAdminId);
        }


        return NextResponse.json({ success: true, message: "Office admin deleted", deletedUser }, { status: 200 });

    } catch (err) {

        console.log(err);
        return NextResponse.json({ success: false, message: "Error during deletion" }, { status: 500 });
    }

}