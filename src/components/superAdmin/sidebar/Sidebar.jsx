"use client"
import Link from "next/link"
import { useState } from "react"

const Sidebar = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={`relative  bg-button-bg   p-6 flex flex-col gap-4 items-center shadow-md ${expandBar ? "w-[40vw] md:w-[15vw] animate-sidebar" : "w-0 "} min-h-[100vh]`}>
            {expandBar && <ul className="  font-heading text-white ">
                <Link href="/dashboard/superAdmin/admins" className="hover:text-gray-300">
                    <li>Admins</li>
                </Link>
                <Link href="/dashboard/superAdmin/restaurants" className="hover:text-gray-300">
                    <li>Restaurants</li>
                </Link>
                <Link href="/dashboard/superAdmin/offices"className="hover:text-gray-300">
                    <li>Offices</li>
                </Link>
                <Link href="/dashboard/superAdmin/orders" className="hover:text-gray-300">
                    <li>Orders</li>
                </Link>
                <Link href="/dashboard/superAdmin/revenue" className="hover:text-gray-300">
                    <li>Revenue</li>
                </Link>
            </ul>}

            <div className=" text-white text-4xl hover:scale-110">
                {expandBar ?
                    <button onClick={() => setExpandBar(false)} >&larr;</button> :
                    <button onClick={() => setExpandBar(true)} >&rarr;</button>
                }
            </div>

        </nav>
    )
}

export default Sidebar