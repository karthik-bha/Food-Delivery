"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const AddEditUserForm = ({ setFormOpen, setUsers, role, userData }) => {
    const isEditMode = !!userData;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const endpoint = role === "office_admin"
                    ? "/api/offices/get/SmallOffice"
                    : "/api/offices/get/RestaurantOffice";

                const response = await axios.get(endpoint);
                if (response.data.success) {
                    setOffices(role === "office_admin" ? response.data.offices : response.data.officeDetails);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching offices:", error);
                toast.error("Failed to load office data");
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setValue("name", userData.name);
            setValue("phone", userData.phone);
            setValue("email", userData.email);
            setValue("office_id", userData.office_id?._id);
        }
    }, [isEditMode, userData, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            if (isEditMode) {
                response = await axios.put(`/api/users/update/${userData._id}`, data);
            } else {
                response = await axios.post(`/api/users/register/${role}`, data);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setUsers((prevUsers) => {
                    if (isEditMode) {
                        return prevUsers.map((user) => (user._id === userData._id ? response.data.updatedUser : user));
                    } else {
                        return [...prevUsers, response.data.newUser];
                    }
                });
                setFormOpen(false);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="relative p-6 shadow-default-shadow flex flex-col gap-4">
            <h2 className="text-sub-heading text-center my-6 font-sub-heading">
                {isEditMode ? "Edit" : "Register"} {role.replace("_", " ")}
            </h2>

            <img
                src="/svgs/cross.svg"
                className="w-6 h-6 hover:cursor-pointer absolute top-2 right-2"
                onClick={() => setFormOpen(false)}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        className="rounded-md p-2 w-full my-4"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                </div>

                {/* Phone */}
                <div>
                    <input
                        type="text"
                        placeholder="Phone"
                        className="rounded-md p-2 w-full my-4"
                        {...register("phone", { required: "Phone is required" })}
                    />
                    {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
                </div>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="rounded-md p-2 w-full my-4"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>

                {/* Password (Only in Register Mode) */}
                {!isEditMode && (
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="rounded-md p-2 w-full my-4"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </div>
                )}

                {/* Office Selection Dropdown */}
                <div>
                    <select
                        {...register("office_id", { required: "Office selection is required" })}
                        className="rounded-md p-2 w-full"
                        defaultValue={isEditMode ? userData.office_id?._id : ""}
                        // disabled={isEditMode} 
                    >
                        <option value="">Select {role === "office_admin" ? "Small Office" : "Restaurant Office"}</option>
                        {offices.map((office) => (
                            <option key={office._id} value={office._id}>
                                {office.name}
                            </option>
                        ))}
                    </select>
                    {errors.office_id && <span className="text-red-500">{errors.office_id.message}</span>}
                </div>

                <button type="submit" className={`btn-primary w-full mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {isEditMode ? "Update" : "Register"}
                </button>
            </form>
        </div>
    );
};

export default AddEditUserForm;
