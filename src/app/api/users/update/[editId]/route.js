import User from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db/connectDB";


export async function PUT(req, { params }) {

    const {editId} = await params;

    // Authenticate the user
    const response = await authMiddleware(req);

    if (response) return response; // If auth fails, return response
    
    const { _id: userId, role } = req.user;
    
    const { isActive, isVeg, name, email, phone, excludeMeal, type } = await req.json();

    // Reject empty requests
    if (!name && !email && !phone && isVeg === undefined && isActive === undefined) {
        return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
    }

    // Check if id was given
    if (!editId) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }
  
    try {
        await connectDB();
        
        let updatedUser;

        // Edit full details of office admin and staff
        if (role === "office_admin" || role === "admin" ) {
           
            // Update the selected
            if(type ==="officeUsers"){
                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { isVeg, isActive, excludeMeal, updatedBy: userId },
                    { new: true }
                );
            }else{
                updatedUser = await User.findByIdAndUpdate(
                    editId,
                    { name, email, phone, isVeg, isActive, excludeMeal, updatedBy: userId },
                    { new: true }
                );
            }
         

        }

        // Edit partial details of staff (lower privileges)
        else if (role === "office_staff" ) {
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

// import User from "@/lib/models/userSchema";
// import { NextResponse } from "next/server";
// import { authMiddleware } from "@/lib/middleware/auth";
// import { connectDB } from "@/lib/db/connectDB";

// // This edit route is exclusive to office admins to edit staff details
// export async function PUT(req, { params }) {

//     const {staffId} = await params;

//     // Authenticate the user
//     const response = await authMiddleware(req);

//     if (response) return response; // If auth fails, return response
//     try {
//         await connectDB();

//         // Get office details from JWT
//         const { _id: officeAdminId, role } = req.user;
//         const { isActive, isVeg, name, email, phone, excludeMeal } = await req.json();
 
//         // Check if user is office admin
//         if (role !== "office_admin") {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
//         }

//         // Check if staff id was given
//         if (!staffId) {
//             return NextResponse.json({ success: false, message: "Staff ID is required" }, { status: 400 });
//         }

//         // Reject empty requests
//         if (!name && !email && !phone && isVeg === undefined && isActive === undefined) {
//             return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
//         }

//         // Update the selected
//         const updatedOfficeStaff = await User.findByIdAndUpdate(
//             staffId,
//             { name, email, phone, isVeg, isActive, excludeMeal, updatedBy: officeAdminId },
//             { new: true }
//         );

//         if (!updatedOfficeStaff) {
//             return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, message: "Staff details updated successfully", updatedOfficeStaff });
//     } catch (err) {
//         console.log(err);
//         return NextResponse.json({ success: false, message: "Error" });
//     }
// }
