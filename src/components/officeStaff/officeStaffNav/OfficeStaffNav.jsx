"use client"
import Link from "next/link"
import axios from "axios"
const OfficeStaffNav = () => {
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            window.location.href = "/login";
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className=" flex justify-between items-center shadow-md mx-auto p-4">
            <div>
                <Link href="/dashboard/officeAdmin" className="text-heading" >
                    <h2 className="text-nav-heading font-heading ">Food Delivery</h2>
                    <p>Office Staff</p>
                </Link>
            </div>
            <button onClick={handleLogout}
                className="font-button-text bg-button-bg hover:bg-button-hover-bg text-white
            px-4 py-2 rounded-md">Logout</button>
        </nav>
    )
}

export default OfficeStaffNav