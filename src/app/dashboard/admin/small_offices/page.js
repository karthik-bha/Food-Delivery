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
  const [smallOffices, setSmallOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSmallOfficeData();
  }, [])

  async function fetchSmallOfficeData() {
    try {
      const response = await axios.get("/api/offices/get/SmallOffice");
      console.log(response.data.offices);
      if (response.data.success) {
        setSmallOffices(response.data.offices);
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
        <AddOfficeForm officeType={"SmallOffice"} setAddOfficeForm={setOpenForm} setOffices={setSmallOffices} />
        : <div className="my-6 mx-2 md:mx-auto">
          <h2 className="text-section-heading">Small Offices</h2>
          <button className="btn-primary my-6" onClick={() => setOpenForm(true)}>Add a small offfice</button>
          <DisplayOffice officeData={smallOffices} officeType={"SmallOffice"} setOffices={setSmallOffices} />
        </div>
      }

    </div>
  )
}

export default Page