"use client"
import Link from "next/link"
import { useState } from "react"

const OfficeAdminSide = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={`relative  bg-button-bg   p-6 flex flex-col gap-4 items-center shadow-md ${expandBar ? "w-[40vw] md:w-[15vw] animate-sidebar" : "w-0 "} min-h-[100vh]`}>
            {expandBar && <ul className=" text-white ">
                <Link href="/dashboard/officeAdmin/restaurant" className="hover:text-gray-300">
                    <li>Restaurant</li>
                </Link>
                <Link href="/dashboard/officeAdmin/myoffice"className="hover:text-gray-300">
                    <li>My Office</li>
                </Link>
                <Link href="/dashboard/superAdmin/myorders" className="hover:text-gray-300">
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

export default OfficeAdminSide