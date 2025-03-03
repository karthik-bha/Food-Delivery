"use client"

import Loader from "@/components/Loader";
import EditOfficeForm from "@/components/officeAdmin/editOfficeForm/EditOfficeForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const Page = () => {
    const [officeData, setOfficeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchOfficeData();
    },[]);
    
    // Fetch Office data on initial load
    const fetchOfficeData = async () => {
        try {
            const response = await axios.get("/api/offices/get/SmallOffice");
            console.log(response);
            if (response.data.success) {
                setOfficeData(response.data.officeData);                         
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch office data.");
        } finally {
            setLoading(false);
        }
    };


    if(loading){
        return <Loader/>
    }
    
    return (
        <div>
             <EditOfficeForm officeData={officeData} setOfficeData={setOfficeData} />
        </div>
    )
}

export default Page