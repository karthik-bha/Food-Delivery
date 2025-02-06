import { NextResponse } from "next/server";
import { verifyToken } from "../jwt"; 
import { cookies } from "next/headers";

export async function authMiddleware(req) {
    const cookie = await cookies();
    const token = cookie.get("token");
    // console.log(token);

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Authentication required" },
            { status: 401 }
        );
    }

    // Verify token, await the promise returned by verifyToken
    const decoded = await verifyToken(token);

    if (!decoded) {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }

    // Attaching user info to request for later use
    req.user = decoded;  // We can use req.user in our routes to access the user data

}
