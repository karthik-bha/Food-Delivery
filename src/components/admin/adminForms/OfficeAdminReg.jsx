"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";

const inputFields = [
  { name: "name", type: "text", placeholder: "Name", validation: { required: "Name is required" } },
  { name: "phone", type: "text", placeholder: "Phone", validation: { required: "Phone is required" } },
  { name: "email", type: "email", placeholder: "Email", validation: { required: "Email is required" } },
  { name: "password", type: "password", placeholder: "Password", validation: {} }, // Password is optional for updates
];

const OfficeAdminReg = ({ setFormOpen, setSmallOfficeAdmins, officeAdmins, selectedAdmin }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedAdmin) {
      // Prefill form values when editing
      setValue("name", selectedAdmin.name);
      setValue("phone", selectedAdmin.phone);
      setValue("email", selectedAdmin.email);
    }
  }, [selectedAdmin, setValue]);

  const onSubmit = async (data) => {
    try {
      let response;
      let isUpdate = Boolean(selectedAdmin);  // Check if it's an update

      if (isUpdate) {
        // Update existing admin
        const editId = selectedAdmin._id;
        response = await axios.put(`/api/users/update/${editId}`, data);
      } else {
        // Register new admin
        response = await axios.post("/api/users/register/office_admin", data);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        setSmallOfficeAdmins((prevAdmins) => {
            if (!prevAdmins) return [response.data.newUser || response.data.updatedUser];

            if (isUpdate) {
                // Only update name, phone, and email for existing admins
                return prevAdmins.map(admin => 
                    admin._id === response.data.updatedUser._id 
                        ? { 
                            ...admin,  // Preserve existing office data
                            name: response.data.updatedUser.name,
                            phone: response.data.updatedUser.phone,
                            email: response.data.updatedUser.email 
                        } 
                        : admin
                );
            } else {
                // Add new user to the list
                return [...prevAdmins, response.data.newUser];
            }
        });

        setFormOpen(false);
      }
    
    } catch (err) {
      console.log(err);
      toast.error(isUpdate ? "Error during update" : "Error during registration");
    }
};


  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="relative p-6 shadow-default-shadow flex flex-col gap-4">
  
        {/* Close Button */}        
        <h2 className="text-sub-heading text-center my-6 ">
          {selectedAdmin ? "Edit Office Admin" : "Register a New Office Admin"}
        </h2>
       
        <img src="/svgs/cross.svg"  className="w-6 h-6 hover:cursor-pointer absolute top-2 right-2" 
        onClick={() => setFormOpen(false)}/>
   


        {/* Input Fields */}
        {inputFields.map(({ name, type, placeholder, validation }) => (
          <div key={name}>
            <input
              type={type}
              placeholder={placeholder}
              className="rounded-md p-2 w-full"
              {...register(name, validation)}
              disabled={name === "email" && selectedAdmin} // Prevent email change on edit
            />
            {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
          </div>
        ))}

        <button className="btn-primary">
          {selectedAdmin ? "Update Admin" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default OfficeAdminReg;

// "use client";

// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// const inputFields = [
//   { name: "name", type: "text", placeholder: "Name", validation: { required: "Name is required" } },
//   { name: "phone", type: "text", placeholder: "Phone", validation: { required: "Phone is required" } },
//   { name: "email", type: "email", placeholder: "Email", validation: { required: "Email is required" } },
//   { name: "password", type: "password", placeholder: "Password", validation: { required: "Password is required" } },
// ];

// const OfficeAdminReg = ({ setFormOpen, setSmallOfficeAdmins, officeAdmins }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
  
//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post("/api/users/register/office_admin", data);
//       if (response.data.success) {
//         toast.success(response.data.message);
        
//         setSmallOfficeAdmins((prevAdmins) => {
//           if (!prevAdmins) return [response.data.newUser];
  
//           return prevAdmins.some(admin => admin._id === response.data.newUser._id)
//             ? prevAdmins.map(admin => 
//                 admin._id === response.data.newUser._id ? response.data.newUser : admin
//               ) 
//             : [...prevAdmins, response.data.newUser];
//         });
  
//         setFormOpen(false);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("Error during registering");
//     }
//   };
  

//   return (
//     <div className="">

//       <form onSubmit={handleSubmit(onSubmit)} className="relative p-4 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] flex flex-col gap-4">
        
//         {/* Close Button */}
//         <p className="absolute top-2 right-4 text-xl font-semibold cursor-pointer"
//           onClick={() => setFormOpen(false)}>x</p>

//         <h2 className="text-sub-heading text-center my-4">Register a new Office Admin</h2>

//         {/* Input Fields */}
//         {inputFields.map(({ name, type, placeholder, validation }) => (
//           <div key={name}>
//             <input
//               type={type}
//               placeholder={placeholder}
//               className="rounded-md p-2 w-full"
//               {...register(name, validation)}
//             />
//             {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
//           </div>
//         ))}

//         <button className="btn-primary ">Register</button>
//       </form>
//     </div>
//   );
// };

// export default OfficeAdminReg;
