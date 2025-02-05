"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const useAuthRedirect = (allowedRoles = []) => {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Redirect to login if no token is found
            return;
        }
        try {
            const decoded = jwtDecode(token); // Decode JWT           
            // Check if the user role is allowed
            if (!allowedRoles.includes(decoded.role)) {
                localStorage.removeItem("token");
                router.push("/login"); // Redirect if role is not allowed
            }
        } catch (error) {
            console.error("Invalid Token", error);
            router.push("/login"); // Redirect to login if token is invalid
        }
    }, [allowedRoles, router]);
};

export default useAuthRedirect;
