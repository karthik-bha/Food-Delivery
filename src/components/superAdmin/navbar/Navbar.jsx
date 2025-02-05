"use client"
import Link from "next/link"
import useAuthRedirect from "@/hooks/useAuthRedirect"
const Navbar = () => {
    useAuthRedirect(["super_admin"]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    
    return (
        <nav className="flex justify-between items-center max-w-[1200px] mx-auto p-4">
            <div>
                <Link href="/dashboard/superAdmin">
                <h2 className="text-heading">Food Delivery</h2>
                <p className="text-red-600">SUPER ADMIN</p>
                </Link>
            </div>
            <ul className="flex gap-2">
                <Link href="/dashboard/superAdmin/registerAdmin">
                    <li>Add Admin</li>
                </Link>
                <Link href="/">
                    <li>Remove Admin</li>
                </Link>
                <Link href="/">
                    <li>View all offices</li>
                </Link>
                <Link href="/">
                    <li>View all users</li>
                </Link>
                <Link href="/">
                    <li>View all orders</li>
                </Link>          
            </ul>
            <button onClick={handleLogout} className="border-2 border-black px-4 py-1 rounded-md">Logout</button>
        </nav>
    )
}

export default Navbar