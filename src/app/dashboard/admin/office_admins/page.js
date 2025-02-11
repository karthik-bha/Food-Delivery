
"use client"
import OfficeAdminReg from "@/components/admin/adminForms/OfficeAdminReg";
import { useState } from "react";
const mockData = [
    {
        _id: 1,
        name: "Office Admin 1",
        email: "john@example.com",
        office_name: "Office 1",
        state: "Bihar",
        district: "Patna",
        street_address: "1, 2nd cross",
    },
    {
        _id: 2,
        name: "Office Admin 2",
        email: "john@example.com",
        office_name: "Office 2",
        state: "Bihar",
        district: "Patna",
        street_address: "1, 2nd cross",
    }
];

const Page = () => {
    const [formOpen, setFormOpen] = useState(false);
    return (
        <div className="mx-4 my-8">
            {formOpen ? <OfficeAdminReg formOpen={formOpen} setFormOpen={setFormOpen}/> :
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Small Office Admins
                    </h2>

                    <div className="flex my-4 ">
                        <button className="bg-primary hover:bg-primary-hover text-white 
                        px-4 py-2 rounded-md"
                        onClick={setFormOpen(true)}>
                            Add a New Office Admin
                        </button>
                    </div>

                    <div>

                        <div className="grid grid-cols-5 bg-primary text-secondary text-center p-2 font-semibold border-b border-black">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Office Name</p>
                            <p>Office Address</p>
                            <p>Actions</p>
                        </div>

                        {/* Data Rows */}
                        <div className="">
                            {mockData.map((item) => (
                                <div key={item._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l border-black p-2">
                                    <p>{item.name}</p>
                                    <p>{item.email}</p>
                                    <p>{item.office_name}</p>
                                    <p className="break-words whitespace-normal">
                                        {item.state}, {item.district}, {item.street_address}
                                    </p>
                                    <div className="flex gap-1 ">
                                        <p className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-300 px-2 rounded-md">Edit</p>
                                        <p className="hover:cursor-pointer bg-red-400 hover:bg-red-300 px-2 rounded-md">Delete</p>
                                        <p className="hover:cursor-pointer bg-green-400 hover:bg-green-300 px-2 rounded-md">View</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }

        </div>
    );
};

export default Page;
