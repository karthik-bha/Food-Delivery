"use client"
import Link from "next/link"
import axios from "axios"
const RestOwnerNav = () => {
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            window.location.href = "/login";
        } catch (err) {
            console.log(err);
        }
    }
 
    return (
        <nav className=" bg-primary text-secondary flex justify-between items-center shadow-md mx-auto p-4">
            <div>
                <Link href="/dashboard/restaurantOwner" className="text-nav-heading-col">
                    <h2 className="text-nav-heading font-heading ">Food Delivery</h2>
                    <p>Restaurant Owner</p>
                </Link>
            </div>
            <button onClick={handleLogout}
                className="border border-white hover:bg-secondary hover:text-primary text-white
            px-4 py-2 rounded-lg">Logout</button> 
        </nav>
    )
}

export default RestOwnerNav