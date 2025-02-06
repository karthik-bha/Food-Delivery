"use client"
import Link from "next/link"
import { useState } from "react"

const OfficeStaffSide = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={`relative  bg-button-bg   p-6 flex flex-col gap-4 items-center shadow-md ${expandBar ? "w-[40vw] md:w-[8vw] animate-sidebar" : "w-0 "} min-h-[100vh]`}>
            {expandBar && <ul className=" text-white ">
                <Link href="/dashboard/officeStaff/restaurant" className="hover:text-gray-300">
                    <li>Meals</li>
                </Link>
                <Link href="/dashboard/officeStaff/myoffice"className="hover:text-gray-300">
                    <li>My Office</li>
                </Link>
                <Link href="/dashboard/officeStaff/myorders" className="hover:text-gray-300">
                    <li>My Orders</li>
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

export default OfficeStaffSide