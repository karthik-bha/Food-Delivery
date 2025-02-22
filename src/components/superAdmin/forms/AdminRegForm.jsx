"use client"
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const FORM_FIELDS = [
    { name: "name", type: "text", placeholder: "Name", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
    { name: "phone", type: "text", placeholder: "Phone", required: true },
];

const AdminRegForm = ({ setFormOpen, setAdminData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
        // console.log("Form Data:", data);
        try{
            const response = await axios.post("/api/users/register/admin", data);
            console.log(response.data);
            
            if (response.data.success) {
                setAdminData(prevAdmins => [...(prevAdmins || []), response.data.newUser]);
                setFormOpen(false);
                toast.success(response.data.message);                
            }

        }catch(err){
            console.log(err);
            toast.error("Error during registering");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow-md rounded-lg bg-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Admin Registration</h2>
                <p className="cursor-pointer text-gray-600 hover:text-gray-800 text-lg font-bold" onClick={() => setFormOpen(false)}>X</p>
            </div>

            {/* Dynamic Fields Rendering */}
            {FORM_FIELDS.map((field) => (
                <div key={field.name} className="mb-4">
                    <input 
                        type={field.type} 
                        {...register(field.name, { 
                            required: field.required ? `${field.placeholder} is required` : false, 
                            minLength: field.minLength ? { value: field.minLength, message: `Must be at least ${field.minLength} characters` } : undefined
                        })} 
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        placeholder={field.placeholder} 
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
                </div>
            ))}

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">
                Register Admin
            </button>
        </form>
    );
};

export default AdminRegForm;
