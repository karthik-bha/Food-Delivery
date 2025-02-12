"use client";
import OfficeAdminForm from "@/components/officeAdmin/officeAdminForm/OfficeAdminForm";
import EditStaffForm from "@/components/officeAdmin/editStaffForm/EditStaffForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [staffData, setStaffData] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openStaffEdit, setOpenStaffEdit] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOfficeStaffData();
    }, []);

    // Fetch staff data
    async function fetchOfficeStaffData() {
        try {
            const response = await axios.get("/api/offices/get/pvt/SmallOffice/staff");
            setStaffData(response.data.staffDetails);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    // Delete staff
    async function deleteStaff(staffId) {
        try {
            setLoading(true);
            const response = await axios.delete(`/api/users/delete/officeStaff/${staffId}`);
            if (response.data.success) {
                setStaffData(staffData.filter((staff) => staff._id !== staffId));
                toast.success(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete staff");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex w-screen justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            {openForm ? (
                <div className="my-6">
                    <OfficeAdminForm setOpenForm={setOpenForm} setStaffData={setStaffData} staffData={staffData} />
                </div>
            ) : openStaffEdit ? (
                <div className="my-6">
                    <EditStaffForm
                        staff={selectedStaff}
                        setOpenForm={setOpenStaffEdit}
                        setStaffData={setStaffData}
                    />
                </div>
            ) : (
                <>
                    <h2 className="my-12 text-section-heading text-center">Staff Details</h2>
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-1 bg-primary text-white hover:bg-primary-hover rounded-md"
                            onClick={() => setOpenForm(true)}
                        >
                            Add New Staff
                        </button>
                        
                    </div>

                    <p className="my-6 text-section-heading">Staff</p>
                    <div className="p-2 text-white md:grid bg-primary rounded-t-md grid-cols-5">
                        <p>Name</p>
                        <p>Email</p>
                        <p>Phone</p>
                        <p>Attendance</p>
                        <p>Actions</p>
                    </div>

                    {staffData.map((staff) => (
                        <div key={staff._id} className="md:grid gap-4 grid-cols-5 border-b border-r border-l border-black p-2">
                            <p>{staff.name}</p>
                            <p>{staff.email}</p>
                            <p>{staff.phone}</p>
                            <p className={`${staff.isActive ? "text-green-500" : "text-red-500"}`}>
                                {staff.isActive ? "Active" : "Inactive"}
                            </p>
                            <div className="flex gap-1">
                                <p
                                    className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-300 px-2 rounded-md"
                                    onClick={() => {
                                        setSelectedStaff(staff);
                                        setOpenStaffEdit(true);
                                    }}
                                >
                                    Edit
                                </p>
                                <p
                                    className="hover:cursor-pointer bg-red-400 hover:bg-red-300 px-2 rounded-md"
                                    onClick={() => deleteStaff(staff._id)}
                                >
                                    Delete
                                </p>
                                <p className="hover:cursor-pointer bg-green-400 hover:bg-green-300 px-2 rounded-md">View</p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default Page;
