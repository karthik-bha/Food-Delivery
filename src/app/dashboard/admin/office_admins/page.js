"use client";
import AddUsersForm from "@/components/admin/adminForms/AddUsersForm";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [officeAdmins, setSmallOfficeAdmins] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        fetchSmallOfficeAdmins();
    }, []);

    async function fetchSmallOfficeAdmins() {
        try {
            const response = await axios.get("/api/admin/smallOfficeAdmins");
            setSmallOfficeAdmins(response.data.smallOfficeAdmins || []);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />;
    }

    async function handleDelete(officeAdmin) {
            // temp fix
            setLoading(true);
        try {
            
            const offficeAdminId = officeAdmin._id;
            const response = await axios.delete(`/api/users/delete/officeAdmin/${offficeAdminId}`);

            if (response.data.success) {
                setSmallOfficeAdmins((prev) => prev.filter(admin => admin._id !== officeAdmin._id));
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during deletion");
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormOpen(true);
    };

    const handleNewRegistration = () => {
        setSelectedAdmin(null);
        setFormOpen(true);
    };

    return (
        <div className="mx-4 my-8">
            {formOpen ? (
                <AddUsersForm setFormOpen={setFormOpen} setUsers={setSmallOfficeAdmins} role="office_admin"
                userData={selectedAdmin} />
            ) : (
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Small Office Admins
                    </h2>

                    <div className="flex my-4">
                        <button className="btn-primary" onClick={handleNewRegistration}>
                            Add a New Office Admin
                        </button>
                    </div>

                    <div>
                        <div className="table-head">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Office Name</p>
                            <p>Office Address</p>
                            <p>Actions</p>
                        </div>

                        {/* Data Rows */}
                        <div className="shadow-default-shadow">
                            {officeAdmins.map((admin) => (
                                <div key={admin._id} className="table-content">
                                    <p>{admin.name}</p>
                                    <p>{admin.email}</p>
                                    <p>{admin.office_id ? admin.office_id.name : "No office registered."}</p>
                                    <p>
                                        {admin.office_id
                                            ? `${admin.office_id.street_address}, ${admin.office_id.district}, ${admin.office_id.state}`
                                            : "No office registered."}
                                    </p>
                                    <div className="flex gap-2 mx-auto justify-center items-center">
                                        <button className="btn-edit" onClick={() => handleEdit(admin)}>
                                            Edit
                                        </button>

                                        <button
                                            className={`btn-delete ${loading ? "disabled:cursor-not-allowed" : ""}`}
                                            onClick={() => {
                                                if (window.confirm(
                                                    "Are you sure you want to delete this user? "
                                                )) {
                                                    handleDelete(admin);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;

