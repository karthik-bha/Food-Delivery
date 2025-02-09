"use client"
import Link from "next/link"
import { useState } from "react"

const Sidebar = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={` text-nav-content bg-primary flex flex-col min-h-[100vh] ${expandBar ? "w-[40vw] md:w-[12vw] animate-sidebar p-4 " : "w-10 p-2 "}`}>
            {expandBar && 
            
            <ul className="  flex flex-col gap-4 ">
                <Link href="/dashboard/superAdmin/admins" className="hover:text-white">
                    <li>ADMINS</li>
                </Link>
                <Link href="/dashboard/superAdmin/restaurants" className="hover:text-white">
                    <li>RESTAURANTS</li>
                </Link>
                <Link href="/dashboard/superAdmin/offices"className="hover:text-white">
                    <li>OFFICES</li>
                </Link>
                <Link href="/dashboard/superAdmin/orders" className="hover:text-white">
                    <li>ORDERS</li>
                </Link>
                <Link href="/dashboard/superAdmin/revenue" className="hover:text-white">
                    <li>REVENUE</li>
                </Link>
            </ul>
            }

            <div className=" text-white hover:scale-110 ">
                {expandBar ?
                    <button onClick={() => setExpandBar(false)} className="text-4xl mx-4" >&larr;</button> :
                    <button onClick={() => setExpandBar(true)} className="text-2xl" >&rarr;</button>
                }
            </div>

        </nav>
    )
}

export default Sidebar