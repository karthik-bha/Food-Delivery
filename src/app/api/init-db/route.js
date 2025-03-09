import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db/connectDB";
import AdminOffice from "@/lib/models/AdminOffice";
import User from "@/lib/models/userSchema";


export async function POST() {
    try {
        await connectDB();

        const superAdminExists = await User.findOne();
        let superAdmin;
        if (!superAdminExists) {
            const hashedPassword = await bcrypt.hash(process.env.DEFAULT_SUPER_ADMIN_PASSWORD, 10);
            superAdmin = await User.create({
                email: process.env.DEFAULT_SUPER_ADMIN_EMAIL,
                name: "super admin",
                phone: "7338283882",
                password: hashedPassword,
                role: "super_admin",
                // createdBy:"system"
            });
            console.log("SuperAdmin created.");
        }

        const adminOfficeExists = await AdminOffice.findOne();
        if (!adminOfficeExists) {
            await AdminOffice.create({
                name: "default admin office",
                email: "defaultadminoffice@gmail.com",
                phone: "72992921992",
                state: "Bihar",
                district: "Patna",
                street_address: "3rd cross, 4th street",
                createdBy: superAdmin._id
            });
            console.log("Admin Office created.");
        }

        return NextResponse.json({ success: true, message: "Initialization complete." }, { status: 200 });
    } catch (error) {
        console.error("Error initializing SuperAdmin:", error);
        return NextResponse.json({ success: false, error: "Database initialization failed." }, { status: 500 });
    }
}
