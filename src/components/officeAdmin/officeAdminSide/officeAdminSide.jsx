"use client"
import Link from "next/link"
import { useState } from "react"

const OfficeAdminSide = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={` text-nav-content bg-primary flex flex-col min-h-[100vh] ${expandBar ? "w-[40vw] md:w-[12vw] animate-sidebar p-4 " : "w-10 p-2 "}`}>
            {expandBar && <ul className="  mt-6 mx-2 flex flex-col gap-2 ">
                <Link href="/dashboard/officeAdmin" className="hover:text-white">
                    <li>DASHBOARD</li>
                </Link>
                <Link href="/dashboard/officeAdmin/restaurant" className="hover:text-white">
                    <li>RESTAURANT</li>
                </Link>
                 <Link href="/dashboard/officeAdmin/myoffice" className="hover:text-white">
                    <li>MY OFFICE</li>
                </Link>
                <Link href="/dashboard/officeAdmin/placeorder" className="hover:text-white">
                    <li>PLACE ORDER</li>
                </Link>
                <Link href="/dashboard/officeAdmin/myorders" className="hover:text-white">
                    <li>MY ORDERS</li>
                </Link>
            </ul>} 

            <div className=" hover:scale-110 ">
                {expandBar ?
                    <button onClick={() => setExpandBar(false)} className="text-4xl mx-4 hover:text-white"  >&larr;</button> :
                    <button onClick={() => setExpandBar(true)} className="text-2xl hover:text-white" >&rarr;</button>
                }
            </div>

        </nav>
    )
}

export default OfficeAdminSide