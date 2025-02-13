import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import bcrypt from "bcrypt"
import AdminOffice from "@/lib/models/AdminOffice";
import SmallOffice from "@/lib/models/SmallOffice";
import RestaurantOffice from "@/lib/models/RestaurantOffice";

export async function POST(req) {
  const { email, password, name, phone } = await req.json();
  if (!email || !password || !name || !phone) {
    return NextResponse.json({ success: false, message: "Email, Name , Phone and Password are required" }, { status: 400 });
  }
  try {
    await connectDB();

    // Check if user exists in any collection using Promise.all
    try {
      const [user, adminOffice, restOffice, smallOffice] = await Promise.all([

        User.findOne({ email }),
        AdminOffice.findOne({ email }),
        RestaurantOffice.findOne({email}),
        SmallOffice.findOne({ email })
      ]);

      if (user || adminOffice ||  restOffice || smallOffice) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error("Error checking existing users:", error);
      return NextResponse.json(
        { success: false, message: "Error checking user existence" },
        { status: 500 }
      );
    }

    // hashing the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const superAdminUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "super_admin",
      office_id: null,
      office_type: 1,
    })
    await superAdminUser.save();
    return NextResponse.json({ success: true, message: "Super Admin Registered Successfully", superAdminUser }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "Error during registration" }, { status: 500 });
  }

}