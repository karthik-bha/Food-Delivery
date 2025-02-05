import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from './lib/jwt'; 

export async function middleware(req) {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        // Now the verifyToken function is async
        const decoded = await verifyToken(token); // Await the result

        if (!decoded) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Role-based access control
        const path = req.nextUrl.pathname;

        if (path.startsWith("/dashboard/superAdmin") && decoded.role !== "super_admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (path.startsWith("/dashboard/admin") && !["super_admin", "admin"].includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (path.startsWith("/dashboard/officeAdmin") && !["super_admin", "admin", "office_admin"].includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (path.startsWith("/dashboard/officeStaff") && !["super_admin", "admin", "office_admin", "office_staff"].includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: [
        "/random"
        // "/dashboard/superAdmin/:path*",
        // "/dashboard/admin/:path*",
        // "/dashboard/officeAdmin/:path*",
        // "/dashboard/officeStaff/:path*",
    ],
};
