"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const inputFields = [
  { name: "name", type: "text", placeholder: "Name", validation: { required: "Name is required" } },
  { name: "phone", type: "text", placeholder: "Phone", validation: { required: "Phone is required" } },
  { name: "email", type: "email", placeholder: "Email", validation: { required: "Email is required" } },
  { name: "password", type: "password", placeholder: "Password", validation: { required: "Password is required" } },
];

const OfficeAdminReg = ({ setFormOpen, setSmallOfficeAdmins, officeAdmins }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/users/register/office_admin", data);
      if (response.data.success) {
        toast.success(response.data.message);
        setSmallOfficeAdmins(prevAdmins => [...(prevAdmins || []), response.data.newUser]);
        setFormOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error during registering");
    }
  };

  return (
    <div className="">

      <form onSubmit={handleSubmit(onSubmit)} className="relative p-4 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] flex flex-col gap-4">
        
        {/* Close Button */}
        <p className="absolute top-2 right-4 text-xl font-semibold cursor-pointer"
          onClick={() => setFormOpen(false)}>x</p>

        <h2 className="text-sub-heading text-center my-4">Register a new Office Admin</h2>

        {/* Input Fields */}
        {inputFields.map(({ name, type, placeholder, validation }) => (
          <div key={name}>
            <input
              type={type}
              placeholder={placeholder}
              className="rounded-md p-2 w-full"
              {...register(name, validation)}
            />
            {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
          </div>
        ))}

        <button className="btn-primary ">Register</button>
      </form>
    </div>
  );
};

export default OfficeAdminReg;
