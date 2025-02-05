import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookie=await cookies();
    // Remove the token cookie
    cookie.set("token", "", { maxAge: -1 });
    return NextResponse.json({ message: "Logged out successfully" });
}
