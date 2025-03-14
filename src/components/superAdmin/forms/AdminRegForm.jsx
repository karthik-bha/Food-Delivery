"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const FORM_FIELDS = [
    { name: "name", type: "text", placeholder: "Name", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    { name: "phone", type: "text", placeholder: "Phone", required: true },
];

const AdminRegForm = ({ setFormOpen, setAdminData, editUser }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffice, setSelectedOffice] = useState(""); // Tracks selected office
    const [showPassword, setShowPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        fetchAdminOffices();

        if (editUser) {
            // Pre-fill form fields except for password
            Object.keys(editUser).forEach((key) => {
                if (key !== "password") {
                    setValue(key, editUser[key]);
                }
            });

            // Set default office if admin has one assigned
            if (editUser.office_id) {
                setSelectedOffice(editUser.office_id._id);
                setValue("office_id", editUser.office_id._id);
            }
        }
    }, [editUser, setValue]);


    async function fetchAdminOffices() {
        try {
            const response = await axios.get("/api/offices/get/AdminOffice");
            setOffices(response.data.adminOffices || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load offices");
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data) {

        setLoading(true);
        try {
            if (editUser) {
                // Update API Call
                const response = await axios.put(`/api/users/update/${editUser._id}`, data);
                if (response.data.success) {
                    setAdminData((prev) =>
                        prev.map((admin) => (admin._id === editUser._id ? response.data.updatedUser : admin))
                    );
                    toast.success(response.data.message);
                }
            } else {
                // New Admin Registration
                const response = await axios.post("/api/users/register/admin", data);
                if (response.data.success) {
                    setAdminData((prevAdmins) => [...(prevAdmins || []), response.data.newUser]);
                    toast.success(response.data.message);
                }
            }
            setFormOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message); 
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />

    return (
        <form onSubmit={handleSubmit(onSubmit)} className=" min-w-[20vw] my-6 p-4 shadow-md rounded-lg bg-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{editUser ? "Edit Admin" : "Admin Registration"}</h2>
                <p className="cursor-pointer text-gray-600 hover:text-gray-800 text-lg font-bold" onClick={() => setFormOpen(false)}>X</p>
            </div>

            {/* Dynamic Fields Rendering */}
            {FORM_FIELDS.map((field) => (
                <div key={field.name} className="mb-4">
                    <input
                        type={field.type}
                        {...register(field.name, {
                            required: field.required ? `${field.placeholder} is required` : false
                        })}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        placeholder={field.placeholder}
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
                </div>
            ))}


            {editUser ? (
                <>
                    <p onClick={() => setChangePassword(!changePassword)} className="cursor-pointer font-semibold">
                        Change password?
                    </p>
                    {changePassword && (
                        <>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    className="rounded-md p-2 w-full my-4"
                                    {...register("password", {
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-sm text-gray-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>

                            </div>
                            {errors.password && <span className="text-red-500 text-[0.7rem]">{errors.password.message}</span>}
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="rounded-md p-2 w-full my-4"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-sm text-gray-600"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    {errors.password && <span className="text-red-500 text-[0.7rem]">{errors.password.message}</span>}
                </>
            )}


            {/* Office Dropdown */}
            <div className="mb-4">
                <select
                    {...register("office_id", { required: "Office selection is required" })}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    value={selectedOffice}
                    onChange={(e) => setSelectedOffice(e.target.value)}
                >
                    <option value="" disabled>Select an Office</option>
                    {offices.map((office) => (
                        <option key={office._id} value={office._id}>
                            {office.name}
                        </option>
                    ))}
                </select>
                {errors.office_id && <p className="text-red-500 text-xs mt-1">{errors.office_id.message}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">
                {editUser ? "Update Admin" : "Register Admin"}
            </button>
        </form>
    );
};

export default AdminRegForm;
