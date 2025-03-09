"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import SuperAdminForm from "@/components/superAdmin/forms/SuperAdminForm";
import Loader from "@/components/Loader";

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [superAdmin, setSuperAdmin] = useState(null);
    

    useEffect(() => {
        fetchSuperAdminData();
    }, []);

    const fetchSuperAdminData = async () => {
        try {
            const response = await axios.get("/api/users/pvtAccess");
            console.log(response.data);
            setSuperAdmin(response.data.userData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />

    return (
        <div>
            <h2 className="text-section-heading mt-12">Your details</h2>
            <p>Edit your details here</p>
            <SuperAdminForm editUser={superAdmin} onClose={fetchSuperAdminData} />
        </div>
    );
};

export default Page;
