import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import User from "@/lib/models/userSchema";
import bcrypt from "bcrypt"

export async function POST(req) {
    const { email, password, name, phone } = await req.json();
    if (!email || !password || !name ||!phone) {
      return NextResponse.json({ success: false, message: "Email, Name , Phone and Password are required" }, { status: 400 });
    }
    try {
      await connectDB();

      // Check if super admin exists  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return NextResponse.json({ success: false, message: "Super Admin Already Exists" }, { status: 400 });
      } 
      
      // hashing the password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const superAdminUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role:"super_admin",
        office_id: null,
        office_type:1,        
      })
      await superAdminUser.save();
      return NextResponse.json({ success: true, message: "Super Admin Registered Successfully", superAdminUser }, { status: 201 });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ success: false, message: "Error during registration" }, { status: 500 });
    }

}