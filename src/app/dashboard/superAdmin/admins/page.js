"use client";

import Loader from "@/components/Loader";
import AdminRegForm from "@/components/superAdmin/forms/AdminRegForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [adminData, setAdminData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // Store user to be edited
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      const response = await axios.get('/api/superAdmin/get/allUsers/admin');
      setAdminData(response.data.users);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(adminId) {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/users/delete/officeAdmin/${adminId}`);
      if (response.data.success) {
        setAdminData((prev) => prev.filter(admin => admin._id !== adminId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error during deletion");
    }finally{
      setLoading(false);  
    }
  }

  function handleEdit(admin) {
    setEditUser(admin); // Set selected user for editing
    setFormOpen(true);  // Open the form
  }

  if (loading) return <Loader />;

  return (
    <div className="my-6 mx-4">
      <h1 className="mt-12 text-section-heading">Admin Manager</h1>

      {formOpen ? (
        <AdminRegForm
          setFormOpen={setFormOpen}
          setAdminData={setAdminData}
          editUser={editUser} // Pass user for editing
        />
      ) : (
        <>
          <div className="flex my-6">
            <button className="btn-primary" onClick={() => { setFormOpen(true); setEditUser(null); }}>
              Add a new admin
            </button>
          </div>

          {/* Table Header */}
          <div className="table-head">
            <p>Name</p>
            <p>Email</p>
            <p>Office Name</p>
            <p>Office Address</p>
            <p>Actions</p>
          </div>

          {adminData?.length > 0 ? (
            <div className="shadow-default-shadow">
              {adminData.map((admin) => (
                <div key={admin._id} className="table-content">
                  <p>{admin.name}</p>
                  <p>{admin.email}</p>
                  <p>{admin.office_id ? admin.office_id.name : "No office assigned"}</p>
                  <p>{admin.office_id ? `${admin.office_id.street_address}, ${admin.office_id.district}, ${admin.office_id.state}` : "No office assigned"}</p>
                  <div className="flex gap-1 mx-auto justify-center">
                    <button className="btn-edit" onClick={() => handleEdit(admin)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(admin._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>No admins yet.</>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
