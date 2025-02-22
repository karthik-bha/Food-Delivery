"use client"

import AdminRegForm from "@/components/superAdmin/forms/AdminRegForm";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

const Page = () => {

  const [adminData, setAdminData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [])

  async function fetchAdminData() {
    try {
      const response = await axios.get('/api/superAdmin/get/allUsers/admin');
      console.log(response.data.users);
      const fetchedData = response.data.users;
      setAdminData(fetchedData);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleDelete(adminId) {
    try {
      const response = await axios.delete(`/api/users/delete/officeAdmin/${adminId}`);
      console.log(response.data.deletedUser);
      if (response.data.success) {
        const deletedUser = response.data.deletedUser;
        setAdminData((prev) => prev.filter(admin => admin._id !== adminId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error during deletion");
    }
  }
  return (
    <div className="my-6 mx-4 ">
      <h1 className="mt-12 text-section-heading">Admin Manager</h1>
      {formOpen ?

        <>
          <AdminRegForm setFormOpen={setFormOpen} setAdminData={setAdminData} />
        </>
        : <>
          <div className="flex my-6 ">
            <button className="btn-primary" onClick={() => setFormOpen(true)}>Add a new admin</button>
          </div>
          {/* for medium large screen  */}
          <div className=" md:grid text-white grid-cols-5 text-center bg-primary font-semibold p-2 rounded-t-md">
            <p>Name</p>
            <p>Email</p>
            <p>Office Name </p>
            <p>Office Address</p>
            <p>Actions</p>
          </div>


          {adminData ?
            <>
              {adminData.map((admin) => {
                return (
                  <div key={admin._id} className=" md:grid items-center  mx-auto grid-cols-5 text-center p-2 border-r border-l border-b border-black">
                    <p>{admin.name}</p>
                    <p>{admin.email}</p>
                    <p>{admin.office_id ? admin.office_id.name : "No office assigned"}</p>
                    <p>{admin.office_id ? admin.office_id.street_address + ", " + admin.office_id.district + ", " + admin.office_id.state :
                      "No office assigned"}</p>
                    <div className="flex gap-1 mx-auto justify-center ">
                      {/* <button className="btn-edit">Edit</button> */}
                      <button className="btn-delete" onClick={() => handleDelete(admin._id)}>Delete</button>
                      {/* <button className="btn-add">View</button> */}
                    </div>

                  </div>
                )
              })}
            </> : <>
              No admins yet.
            </>
          }


        </>}


    </div>
  )
}

export default Page