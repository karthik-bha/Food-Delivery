"use client";
import Loader from "@/components/Loader";
import AddStaffForm from "@/components/officeAdmin/addStaffForm/AddStaffForm";
import EditStaffForm from "@/components/officeAdmin/editStaffForm/EditStaffForm";
import ViewStaff from "@/components/officeAdmin/viewStaff/ViewStaff";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [staffData, setStaffData] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openStaffEdit, setOpenStaffEdit] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openViewForm, setOpenViewForm] = useState(false);

    useEffect(() => {
        fetchOfficeStaffData();
    }, []);

    // Fetch staff data
    async function fetchOfficeStaffData() {
        try {
            const response = await axios.get("/api/offices/get/SmallOffice/staff");
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
        return <Loader />;
    }

    return (
        <div>
            {openForm ? (
                <div className="my-6">
                    <AddStaffForm setOpenForm={setOpenForm} setStaffData={setStaffData} staffData={staffData} />
                </div>
            ) : openStaffEdit ? (
                <div className="my-6">
                    <EditStaffForm
                        staff={selectedStaff}
                        setOpenForm={setOpenStaffEdit}
                        setStaffData={setStaffData}
                    />
                </div>
            ) : openViewForm?(
                <div className="my-6">
                    <ViewStaff selectedStaff={selectedStaff} setOpenViewForm={setOpenViewForm} />
                </div>
            ):(
                <>
                    <h2 className="my-12 text-section-heading text-center">Staff Details</h2>
                    <div className="flex gap-2">
                        <button
                            className="btn-primary"
                            onClick={() => setOpenForm(true)}
                        >
                            Add New Staff
                        </button>

                    </div>

                    <p className="my-6 text-section-heading">Staff</p>
                    <div className="p-2 text-table-heading md:grid bg-primary font-table-heading rounded-t-md grid-cols-5">
                        <p>Name</p>
                        <p>Email</p>
                        <p>Phone</p>
                        <p>Attendance</p>
                        <p>Actions</p>
                    </div>
                    <div className="shadow-default-shadow">
                    {staffData.map((staff) => (
                        <div key={staff._id} className="md:grid gap-4 grid-cols-5 border-b border-r border-l p-2">
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
                                <p className="hover:cursor-pointer bg-green-400 hover:bg-green-300 px-2 rounded-md"
                                onClick={() => {
                                    setOpenViewForm(true)
                                    setSelectedStaff(staff);

                                }}>View</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
