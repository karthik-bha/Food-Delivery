"use client"
import Link from "next/link"
import { useState } from "react"

const AdminSideNav = () => {
    const [expandBar, setExpandBar] = useState(false);
    return (
        <nav className={` text-nav-content bg-primary flex flex-col min-h-[100vh] ${expandBar ? "w-[40vw] md:w-[12vw] animate-sidebar p-4 " : "w-10 p-2 "}`}>
            {expandBar && <ul className="  mt-6 mx-2 flex flex-col gap-2 ">
                <Link href="/dashboard/admin" className="hover:text-white">
                    <li>DASHBOARD</li>
                </Link>
                {/* <Link href="/dashboard/admin/map" className="hover:text-white">
                    <li>MAP OFFICE TO RESTAURANT</li>
                </Link> */}
                <Link href="/dashboard/admin/small_offices" className="hover:text-white">
                    <li>SMALL OFFICES</li>
                </Link>
                <Link href="/dashboard/admin/restaurant_offices" className="hover:text-white">
                    <li>RESTAURANTS</li>
                </Link>
                <Link href="/dashboard/admin/office_admins" className="hover:text-white">
                    <li>SMALL OFFICE ADMINS</li>
                </Link>
                <Link href="/dashboard/admin/restaurant_owners" className="hover:text-white">
                    <li>RESTAURANT OWNERS</li>
                </Link>

                <Link href="/dashboard/admin/mapping" className="hover:text-white">
                    <li>MAP RESTAURANT TO OFFICE</li>
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

export default AdminSideNav;