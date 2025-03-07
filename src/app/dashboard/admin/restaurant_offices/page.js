"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import DisplayOffice from "@/components/DisplayOffice";
import Loader from "@/components/Loader";
import AddOfficeForm from "@/components/AddOfficeForm";




const Page = () => {
    const [openForm, setOpenForm] = useState(false);
    const [restOffices, setRestOffices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestOfficeData();
    }, [])

    async function fetchRestOfficeData() {
        try {
            const response = await axios.get("/api/offices/get/RestaurantOffice");
            console.log(response.data.officeDetails);
            if (response.data.success) {
                setRestOffices(response.data.officeDetails);
                toast.success("Data fetched successfully!");

            }

        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            {openForm ?
                <AddOfficeForm officeType={"RestaurantOffice"} setAddOfficeForm={setOpenForm} setOffices={setRestOffices} />
                : <div className="my-6 mx-2 md:mx-auto">
                    <h2 className="text-section-heading">Restuarant Offices</h2>
                    <button className="btn-primary my-6" onClick={() => setOpenForm(true)}>Add a Restuarant Office</button>
                    <DisplayOffice officeData={restOffices} officeType={"Restaurant"} setOffices={setRestOffices} />
                </div>
            }

        </div>
    )
}

export default Page