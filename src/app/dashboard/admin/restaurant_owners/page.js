"use client";
import AddOfficeForm from "@/components/AddOfficeForm";
import RestOwnerReg from "@/components/admin/adminForms/RestOwnerReg";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [restaurantOwners, setRestaurantOwners] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addOfficeForm, setAddOfficeForm] = useState(false);
    const [linkedUser, setLinkedUser] = useState(null);
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
        try {
            const restOffice = restOwner.office_id;
            let response;
            if (!restOffice) {
                response = await axios.delete(`/api/users/delete/restOwner/${restOwner._id}`);
            } else {
                const id = restOwner.office_id._id;
                response = await axios.delete(`/api/offices/delete/${id}?type=Restaurant`);
            }

            if (response.data.success) {
                setRestaurantOwners((prev) => prev.filter(owner => owner._id !== restOwner._id));
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during deletion");
        }
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="mx-4 my-8">
            {formOpen ? (
                <RestOwnerReg
                    setFormOpen={setFormOpen}
                    restaurantOwners={restaurantOwners}
                    setRestaurantOwners={setRestaurantOwners}
                    selectedOwner={selectedAdmin} // Pass selected owner for editing
                />
            ) : addOfficeForm ? (
                <AddOfficeForm
                    linkedUserId={linkedUser._id}
                    linkedUserName={linkedUser.name}
                    setAddOfficeForm={setAddOfficeForm}
                    officeType={"RestaurantOffice"}
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
                        <div className="md:grid grid-cols-5 bg-primary text-secondary text-center p-2 font-semibold border-b">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Office Name</p>
                            <p>Office Address</p>
                            <p>Actions</p>
                        </div>

                        {/* Data Rows */}
                        <div className="shadow-default-shadow">
                            {restaurantOwners.map((owner) => (
                                <div key={owner._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l p-2">
                                    <p>{owner.name}</p>
                                    <p>{owner.email}</p>
                                    <p>{owner.office_id ? owner.office_id.name : "No office registered."}</p>
                                    <p>
                                        {owner.office_id
                                            ? `${owner.office_id.street_address}, ${owner.office_id.district}, ${owner.office_id.state}`
                                            : "No office registered."}
                                    </p>

                                    <div className="flex gap-2 mx-auto justify-center items-center">
                                        {!owner.office_id && (
                                            <button
                                                className="btn-add"
                                                onClick={() => {
                                                    setAddOfficeForm(true);
                                                    setLinkedUser(owner);
                                                }}
                                            >
                                                Add office
                                            </button>
                                        )}
                                        <button className="btn-edit" onClick={() => handleEdit(owner)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm(
                                                    "Are you sure you want to delete? All office users and mappings will be deleted."
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
