"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditOfficeForm from "@/components/officeAdmin/editOfficeForm/EditOfficeForm";

const OfficeAdmin = () => {
  const [officeData, setOfficeData] = useState(null);
  const[staffData, setStaffData]=useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [officeStatus, setOfficeStatus] = useState(null);
  const [officeForm, setOfficeForm]=useState(false);

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const response = await axios.get("/api/offices/get/pvt/SmallOffice");
        console.log(response);
        if (response.data.success) {
          setOfficeData(response.data.officeData);
          setStaffData(response.data.staffStats);
          setOfficeStatus(response.data.officeData.isActive);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch office data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeData();
  }, []);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put("/api/offices/update/pvt/SmallOffice", {
        isActive: officeStatus,
      });
      if (response.data.success) {
        toast.success("Office status updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update office status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex w-screen justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div></div>;
  }

  return (
    
    <div className="py-12">
      {officeForm? 
      <>       
        <EditOfficeForm setOfficeForm={setOfficeForm} officeData={officeData} setOfficeData={setOfficeData}/>
      </>
      :
      <>
      <h2 className="text-center text-section-heading my-6">Overview</h2>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 mx-2 md:w-[50vw]">
        {/* Office Details */}
        <div className="shadow-md flex flex-col gap-2 mx-auto w-full">
          <div className="text-secondary bg-primary rounded-t-lg p-4">
            <h2 className="text-section-heading font-sub-heading">Office details</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <p><span className="font-semibold">Name:</span> {officeData.name}</p>
            <p className="font-semibold">Address</p>
            <div className="mx-2">
              <p><span className="font-semibold">State:</span> {officeData.state}</p>
              <p><span className="font-semibold">District:</span> {officeData.district}</p>
              <p><span className="font-semibold">Street:</span> {officeData.street_address}</p>
            </div>
            <p className={`${officeStatus ? "text-green-400" : "text-red-500"}`}><span className="text-black font-semibold">Status:</span> {officeStatus ? "Active" : "Inactive"}</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Set status:</p>
              <select
                className="border border-black rounded-md px-2 py-1 my-2"
                value={officeStatus.toString()}
                onChange={(e) => setOfficeStatus(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <button
                className="px-4 py-1 rounded-md bg-primary hover:bg-primary-hover text-white"
                onClick={handleStatusUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Confirm"}
              </button>
            </div>
            <button className="px-4 py-1 bg-primary text-white hover:bg-primary-hover rounded-md"
            onClick={()=>setOfficeForm(true)}>
              Edit other office details
            </button>
          </div>
        </div>

        {/* Staff Details */}
        <div className="shadow-md flex flex-col gap-2 mx-auto w-full">
          <div className="text-secondary bg-primary rounded-t-lg p-4">
            <h2 className="text-section-heading font-sub-heading">Staff overview</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <p><span className="font-bold">Total staff: </span>{staffData.totalStaff}</p>
            <p><span className="font-bold">Total active staff: </span>{staffData.activeCount}</p>
            <p><span className="font-bold">Veg Staff: </span> {staffData.vegCount}</p>
            <p><span className="font-bold">Non-Veg Staff: </span> {staffData.nonVegCount}</p>
            <p><span className="font-bold">Today's Menu:</span></p>
            <div className="mx-2">
              <p><span className="text-green-600">Veg:</span> Roti, Tea, Rajma, Lassi.</p>
              <p><span className="text-red-600">Non-Veg:</span> Chicken Biryani, Lassi.</p>
            </div>
            <div className="flex">
              <button className="bg-black border hover:bg-primary-hover 
              text-white px-4 py-2 rounded-lg">Quick order</button>
            </div>
          </div>
        </div>
      </div>
      </>
      }
      
    </div>
  );
};

export default OfficeAdmin;
