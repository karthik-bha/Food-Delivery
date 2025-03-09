"use client"

import AddOfficeForm from "@/components/AddOfficeForm"
import DisplayOffice from "@/components/DisplayOffice";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
const Page = () => {
    const [addOfficeForm, setAddOfficeForm] = useState(false);
    const [officeData, setOfficeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminOffices();
    }, [])

    async function fetchAdminOffices() {
        try {
            let response = await axios.get("/api/offices/get/AdminOffice");
            const fetchedData = response.data
            setOfficeData(fetchedData.adminOffices);
            console.log(response)
        } catch (err) {
            console.log(err);
           
        }finally{
            setLoading(false);
        }
    }

    if(loading) return <Loader />
    return (
        <div>
            {addOfficeForm ?
                <AddOfficeForm officeType="AdminOffice" setAddOfficeForm={setAddOfficeForm} /> :
                <>
                    <h2 className="mt-12 text-section-heading">Admin Offices</h2>
                    <button className="btn-primary my-6"
                    onClick={() => setAddOfficeForm(true)}>Add admin office</button>             
                    <div>
                        <DisplayOffice officeData={officeData} officeType="AdminOffice" setOffices={setOfficeData} />
                    </div>
                </>
            }

        </div>
    )
}

export default Page