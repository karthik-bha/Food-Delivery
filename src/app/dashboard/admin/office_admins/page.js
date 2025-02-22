
"use client"
import OfficeAdminReg from "@/components/admin/adminForms/OfficeAdminReg";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {

    const [formOpen, setFormOpen] = useState(false);
    const [officeAdmins, setSmallOfficeAdmins] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSmallOfficeAdmins();
    }, [])

    async function fetchSmallOfficeAdmins() {
        try {
            const response = await axios.get("/api/admin/smallOfficeAdmins");
            console.log(response.data.smallOfficeAdmins);
            setSmallOfficeAdmins(response.data.smallOfficeAdmins || []);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        } finally {
            setLoading(false);
        }
    }
    if (loading || !officeAdmins) {
        return <Loader />
    }

    async function handleDelete(officeAdminId) {
        try {
            const response = await axios.delete(`/api/users/delete/officeAdmin/${officeAdminId}`);
            console.log(response.data.deletedUser);
            if (response.data.success) {
                const deletedUser = response.data.deletedUser;
                setSmallOfficeAdmins((prev) => prev.filter(admin => admin._id !== officeAdminId));
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during deletion");
        }
    }
    return (
        <div className="mx-4 my-8">
            {formOpen ? <OfficeAdminReg setFormOpen={setFormOpen} officeAdmins={officeAdmins} setSmallOfficeAdmins={setSmallOfficeAdmins} /> :
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Small Office Admins
                    </h2>

                    <div className="flex my-4 ">
                        <button className="btn-primary                        "
                            onClick={() => setFormOpen(true)}>
                            Add a New Office Admin
                        </button>
                    </div>

                    <div>

                        <div className="md:grid grid-cols-5 bg-primary text-secondary text-center p-2 font-semibold border-b border-black">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Office Name</p>
                            <p>Office Address</p>
                            <p>Actions</p>
                        </div>

                        {/* Data Rows */}
                        <div className="">
                            {officeAdmins.map((admin) => {
                                return (
                                    <div key={admin._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l border-black p-2">
                                        <p>{admin.name}</p>
                                        <p>{admin.email}</p>

                                        <p>{admin.office_id ? admin.office_id.name : "No office resgistered."}</p>
                                        <p>{admin.office_id ? admin.office_id.street_address + ", " + admin.office_id.district + ", " +
                                            admin.office_id.state : " No office registered."} </p>
                                        <div>
                                            <button className="btn-delete"
                                                onClick={() => handleDelete(admin._id)}>delete</button>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </>
            }

        </div>
    );
};

export default Page;
