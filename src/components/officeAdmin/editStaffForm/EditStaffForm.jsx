"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const EditStaffForm = ({ setOpenForm, setStaffData, staff }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: staff.name || "",
            email: staff.email || "",
            phone: staff.phone || "",
            isVeg: staff.isVeg,
            isActive: staff.isActive
        }
    });
    
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/users/update/officeStaff/${staff._id}`, data);

            if (response.data.success) {
                toast.success(response.data.message);
                setStaffData(prevData =>
                    prevData.map(s => (s._id === staff._id ? response.data.updatedOfficeStaff : s))
                );
                setOpenForm(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex w-screen justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="relative shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] my-12">
            <button
                className="absolute top-2 right-2 text-[0.9rem] text-button-bg hover:text-button-hover-bg"
                onClick={() => setOpenForm(false)}
            >
                X
            </button>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 max-w-[80vw] rounded-lg shadow-lg flex flex-col gap-4 w-80"
            >
                <h2 className="text-nav-heading font-semibold text-center">Edit Staff Details</h2>

                {/* Name input */}
                <div>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Name"
                    />
                </div>

                {/* Phone input */}
                <div>
                    <input
                        type="text"
                        {...register("phone")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Phone"
                    />
                </div>

                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Email"
                    />
                </div>

                {/* Meal Preference Dropdown */}
                <div>
                    <label className="block text-sm font-medium">Meal Preference</label>
                    <select {...register("isVeg")} className="w-full p-2 border rounded mt-1">
                        <option value={true}>Veg</option>
                        <option value={false}>Non-Veg</option>
                    </select>
                </div>

                {/* Active Status */}
                <div>
                    <label className="block text-sm font-medium">Active Status</label>
                    <select {...register("isActive")} className="w-full p-2 border rounded mt-1">
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-primary"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditStaffForm;
