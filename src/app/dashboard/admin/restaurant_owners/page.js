"use client";
import AddUsersForm from "@/components/admin/adminForms/AddUsersForm";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [restaurantOwners, setRestaurantOwners] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        fetchRestOwners();
    }, []);

    async function fetchRestOwners() {
        try {
            const response = await axios.get("/api/admin/restOwners");
            console.log(response.data.restOwners);
            setRestaurantOwners(response.data.restOwners || []);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (owner) => {
        setSelectedAdmin(owner);
        setFormOpen(true);
    };

    const handleNewRegistration = () => {
        setSelectedAdmin(null);
        setFormOpen(true);
    };

    async function handleDelete(restOwner) {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/users/delete/restOwner/${restOwner._id}`);
            if (response.data.success) {
                setRestaurantOwners((prev) => prev.filter(owner => owner._id !== restOwner._id));
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

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="mx-4 my-8">
            {formOpen ? (
                <AddUsersForm
                    setFormOpen={setFormOpen}
                    setUsers={setRestaurantOwners}
                    role="restaurant_owner"
                    userData={selectedAdmin} // Passing this enables editing and updating
                />

            ) : (
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Restaurant Owners
                    </h2>

                    <div className="flex my-4">
                        <button
                            className="btn-primary px-4 py-2 rounded-md"
                            onClick={handleNewRegistration}
                        >
                            Add a New Restaurant Owner
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
                            {restaurantOwners.map((owner) => (
                                <div key={owner._id} className="table-content">
                                    <p>{owner.name}</p>
                                    <p>{owner.email}</p>
                                    <p>{owner.office_id ? owner.office_id.name : "No office registered."}</p>
                                    <p>
                                        {owner.office_id
                                            ? `${owner.office_id.street_address}, ${owner.office_id.district}, ${owner.office_id.state}`
                                            : "No office registered."}
                                    </p>

                                    <div className="flex gap-2 mx-auto justify-center items-center">
                                        <button className="btn-edit" onClick={() => handleEdit(owner)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm(
                                                    "Are you sure you want to delete this user?"
                                                )) {
                                                    handleDelete(owner);
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
