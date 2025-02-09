"use client"
import Link from "next/link"
import { useState } from "react"

const OfficeStaffSide = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={` text-nav-content bg-primary flex flex-col min-h-[100vh] ${expandBar ? "w-[40vw] md:w-[12vw] animate-sidebar p-4 " : "w-10 p-2 "}`}>
            {expandBar && <ul className="  flex flex-col gap-4 mt-6">
                <Link href="/dashboard/officeStaff/meals" className="hover:text-white">
                    <li>MEALS</li>
                </Link>
                <Link href="/dashboard/officeStaff/myoffice" className="hover:text-white">
                    <li>MY OFFICE</li>
                </Link>
                <Link href="/dashboard/officeStaff/myorders" className="hover:text-white">
                    <li>ORDERS</li>
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

export default OfficeStaffSide