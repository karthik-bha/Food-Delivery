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
            isActive: staff.isActive,
            excludeMeal: staff.excludeMeal
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/users/update/${staff._id}`, data);

            if (response.data.success) {
                toast.success(response.data.message);
                setStaffData(prevData =>
                    prevData.map(s => (s._id === staff._id ? response.data.updatedUser : s))
                );
                setOpenForm(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-[30vw] relative  p-6 bg-white rounded-lg shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] max-w-md mx-auto my-12">
            {/* Close Button */}
            <button className="btn-primary absolute top-4 right-2" onClick={() => setOpenForm(false)}>
                x
            </button>

            <h2 className="text-xl font-semibold  ">Edit Staff Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                {/* Name */}
                <input
                    type="text"
                    {...register("name")}
                    className="w-full p-2 border rounded"
                    placeholder="Name"
                />

                {/* Phone */}
                <input
                    type="text"
                    {...register("phone")}
                    className="w-full p-2 border rounded"
                    placeholder="Phone"
                />

                {/* Email */}
                <input
                    type="email"
                    {...register("email")}
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                />

                {/* Meal Preference */}
                <label className="text-sm font-medium">Meal Preference</label>
                <select {...register("isVeg", { valueAsBoolean: true })} className="w-full p-2 border rounded">
                    <option value="true">Veg</option>
                    <option value="false">Non-Veg</option>
                </select>

                {/* Active Status */}
                <label className="text-sm font-medium">Active Status</label>
                <select {...register("isActive", { valueAsBoolean: true })} className="w-full p-2 border rounded">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                {/* Exclude Meal */}
                <label className="text-sm font-medium">Exclude Regular Meal?</label>
                <select {...register("excludeMeal", { valueAsBoolean: true })} className="w-full p-2 border rounded">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                {/* Submit Button */}
                <button type="submit" className="btn-primary flex justify-center" disabled={loading}>
                    {loading ? <span className="animate-spin border-t-2 border-white rounded-full h-5 w-5"></span> : "Update"}
                </button>
            </form>
        </div>
    );
};

export default EditStaffForm;
