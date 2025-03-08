"use client"

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import OfficeEditForm from "./admin/adminForms/OfficeEditForm";
import Loader from "./Loader";

const DisplayOffice = ({ officeData, officeType, setOffices }) => {

    const [editOffice, setEditOffice] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleDelete(office) {
        setLoading(true);
        try {
            const id = office._id;
            const response = await axios.delete(`/api/offices/delete/${id}?type=${officeType}`);
            if (response.data.success) {
                toast.success(response.data.message);
                setOffices(prevOffices => prevOffices.filter(office => office._id !== id));
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }finally{
            setLoading(false);
        }
    }
    if(loading) return <Loader/>
    return (
        <div>
            {editOffice ?
                <>
                    <OfficeEditForm 
                    setEditOffice={setEditOffice}
                    selectedOfficeData={selectedOffice} 
                    setOfficeData={setOffices}
                    officeType={officeType}/>
                </> : <>
                    <div className="table-head">
                        <p>Name</p>
                        <p>Email</p>
                        <p>Phone</p>
                        <p>Address</p>
                        <p>Action</p>
                    </div>
                    <div className="shadow-default-shadow">
                        {officeData.map((office) => {
                            return (
                                <div key={office._id} className="table-content">

                                    <p>{office.name}</p>
                                    <p>{office.email}</p>
                                    <p>{office.phone}</p>
                                    <p>{office.street_address}</p>
                                    <div className="flex items-center gap-2 mx-auto justify-center">
                                        <button className="btn-edit"
                                            onClick={() => { 
                                                setSelectedOffice(office);
                                                setEditOffice(true);
                                            }}>
                                            Edit
                                        </button>
                                        <button className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm(
                                                    "Are you sure you want to delete this office?"
                                                )) {
                                                    handleDelete(office);
                                                }
                                            }}>
                                            Delete</button>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>}

        </div>
    )
}

export default DisplayOffice