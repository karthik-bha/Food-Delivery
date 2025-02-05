"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Redirect = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login"); // Redirect to login if no token is found
            return;
        }

        try {
            const decoded = jwtDecode(token); // Decode JWT
            const currentTime = Date.now() / 1000; // Get current time in seconds

            // Check if the token is expired
            if (decoded.exp < currentTime) {
                localStorage.removeItem("token"); // Remove expired token
                router.push("/login"); // Redirect to login if token is expired
                return;
            }

            // Redirect based on the role
            if (decoded.role === "super_admin") {
                router.replace("/dashboard/superAdmin");
            } else if (decoded.role === "admin") {
                router.replace("/dashboard/admin");
            } else if (decoded.role === "office_admin") {
                router.replace("/dashboard/officeAdmin");
            } else if (decoded.role === "office_staff") {
                router.replace("/dashboard/officeStaff");
            } else {
                router.replace("/login"); // Default case if role is invalid or not recognized
            }
        } catch (error) {
            console.error("Invalid Token", error);
            router.push("/login"); // Redirect to login if token is invalid
        }
    }, [router]);

    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <p>You're being redirected, Please wait...</p>
        </div>
    );
};

export default Redirect;
