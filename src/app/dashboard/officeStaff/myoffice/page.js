"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const Page = () => {
    const [officeData, setOfficeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(true);
    const [error, setError] = useState(null);

    // Fetch office data
    const fetchOfficeData = async () => {
        try {
            const response = await axios.get("/api/offices/get/pvt/SmallOffice");
            if (response.data.success) {
                const data = response.data.officeData;
                setOfficeData(data);
                setStatus(data.isActive);
            } else {
                throw new Error(response.data.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Update office status
    const updateStatus = async () => {
        try {
            const response = await axios.put("/api/offices/update/pvt/SmallOffice", { isActive: status });
            if (response.data.success) {
                toast.success(response.data.message);
                setOfficeData((prev) => ({ ...prev, isActive: status })); // Updates state
            } else {
                throw new Error(response.data.message || "Failed to update status");
            }
        } catch (err) {
            toast.error(err.message || "Error updating status");
            console.error("Error updating status:", err);
        }
    };

    useEffect(() => {
        fetchOfficeData();
    }, []);

    if (loading) return <Loader/>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            {/* Office Details Card */}
            <div className="my-12 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] mx-auto">
                <div className="bg-primary text-secondary rounded-t-md">
                    <h2 className="p-4 text-heading text-sub-heading">Office Details</h2>
                </div>
                <div className="p-4">
                    <p><span className="font-bold">Name:</span> {officeData.name}</p>
                    <p><span className="font-bold">Phone:</span> {officeData.phone}</p>
                    <p><span className="font-bold">Email:</span> {officeData.email}</p>
                    <p><span className="font-bold">Address:</span> {officeData.street_address}, {officeData.district}, {officeData.state}</p>
                    <p className={`${officeData.isActive ? "text-green-500" : "text-red-500"}`}><span className="text-black font-bold">Status:</span> {officeData.isActive ? "Active" : "Inactive"}</p>
                </div>
            </div>

            {/* Office Status Update */}
            <div className="my-4 flex flex-col">
                <p className="text-sub-heading">Change Office Status</p>
                <select
                    value={status.toString()}
                    onChange={(e) => setStatus(e.target.value === "true")}
                    className="border rounded-md border-primary px-2 py-1 my-2"
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <button
                    onClick={updateStatus}
                    className="bg-primary hover:bg-primary-hover text-secondary rounded-md px-2 py-1"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default Page;
