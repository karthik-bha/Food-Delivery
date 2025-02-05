import { NextResponse } from "next/server";
import { verifyToken } from "../jwt";
export function authMiddleware(req) {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Get token from the Authorization header (Bearer token)
    if (!token) {
        return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Attach user info to request for later use
    req.user = decoded; // You can use req.user in your routes to access the user data

    return null; 
}