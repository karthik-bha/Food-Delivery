
"use client"
import RestOwnerReg from "@/components/admin/adminForms/RestOwnerReg";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {

    const [formOpen, setFormOpen] = useState(false);
    const [restaurantOwners, setRestaurantOwners] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchRestOwners();
    }, [])

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
    if (loading || !restaurantOwners) {
        return <Loader />
    }

    async function handleDelete(restOwnerId) {
        try {
            const response = await axios.delete(`/api/users/delete/restOwner/${restOwnerId}`);
            console.log(response.data.deletedUser);
            if (response.data.success) {
                const deletedUser = response.data.deletedUser;
                setRestaurantOwners((prev) => prev.filter(owner => owner._id !== restOwnerId)); 
                toast.success(response.data.message);
            }else{
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during deletion");
        }
    }
    return (
        <div className="mx-4 my-8">
            {formOpen ? <RestOwnerReg setFormOpen={setFormOpen} restaurantOwners={restaurantOwners} setRestaurantOwners={setRestaurantOwners} /> :
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Restaurant Owners
                    </h2>

                    <div className="flex my-4 ">
                        <button className="btn-primary
                        px-4 py-2 rounded-md"
                            onClick={() => setFormOpen(true)}>
                            Add a New Restaurant Owner
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
                            {restaurantOwners.map((owner) => {
                                return (
                                    <div key={owner._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l border-black p-2">
                                        <p>{owner.name}</p>
                                        <p>{owner.email}</p>

                                        <p>{owner.office_id ? owner.office_id.name : "No office resgistered."}</p>
                                        <p>{owner.office_id ? owner.office_id.street_address + ", " + owner.office_id.district + ", " +
                                            owner.office_id.state : " No office registered."} </p>
                                        <div>
                                            <button className="btn-delete"
                                                onClick={() => handleDelete(owner._id)}>delete</button>
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
