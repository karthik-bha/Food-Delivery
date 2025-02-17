"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [officeData, setOfficeData] = useState(null);

    useEffect(() => {
        fetchOfficeData();
    }, []);

    async function fetchOfficeData() {
        try {
            const response = await axios.get("/api/mapping/get");
            const fetchedData = response.data.mappings;
            console.log(fetchedData);
            setOfficeData(fetchedData);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        }
    }

    return (
        <div className="max-w-5xl mx-auto my-12">
            <h2 className="text-center text-2xl font-bold mb-6">Small Offices Assigned</h2>

            {officeData ? (
                officeData.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-black text-white text-lg font-semibold py-3 px-4 text-center">
                            <p>Small Office Name</p>
                            <p>Address</p>
                            <p>Phone Number</p>
                            <p>Status</p>
                        </div>

                        {/* Body */}
                        <div>
                            {officeData.map((mapping, index) => (
                                <div
                                    key={mapping._id}
                                    className={`grid grid-cols-4 py-3 px-4 text-center ${
                                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                    }`}
                                >
                                    <p>{mapping.office_id.name}</p>
                                    <p>{mapping.office_id.street_address}, {mapping.office_id.district}, {mapping.office_id.state}</p>
                                    <p>{mapping.office_id.phone}</p>
                                    <p className={`font-semibold ${mapping.office_id.isActive ? "text-green-600" : "text-red-600"}`}>
                                        {mapping.office_id.isActive ? "Active" : "Inactive"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-lg text-gray-500">No offices found.</p>
                )
            ) : (
                <p className="text-center text-lg text-gray-500">Loading...</p>
            )}
        </div>
    );
};

export default Page;
