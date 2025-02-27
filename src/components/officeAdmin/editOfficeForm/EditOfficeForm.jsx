"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const EditOfficeForm = ({ setOfficeForm, officeData, setOfficeData}) => {
    const office=officeData;
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: office?.name || "",
            email: office?.email || "",
            phone: office?.phone || "",
            street_address: office?.street_address || "",
            district: office?.district || "",
            state: office?.state || "",
            isActive: office?.isActive || false,
        }
    });
    
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/offices/update/pvt/SmallOffice`, data);
            console.log(response);
            if (response.data.success) {
                toast.success(response.data.message+", Please refresh");  
                setOfficeData(response.data.updatedOffice);                              
                setOfficeForm(false);
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

    return (
        <div className="relative shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] my-12 p-6 bg-white rounded-lg max-w-[80vw] w-80">
            <button
                className="absolute top-2 right-2 text-[0.9rem] text-button-bg hover:text-button-hover-bg"
                onClick={() => setOfficeForm(false)}
            >
                X
            </button>
            <h2 className="text-nav-heading font-semibold text-center mb-4">Edit Office Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Name input */}
                <div>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Phone input */}
                <div>
                    <input
                        type="text"
                        {...register("phone", { required: "Phone is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Street Address */}
                <div>
                    <input
                        type="text"
                        {...register("street_address")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Street Address"
                    />
                </div>

                {/* District */}
                <div>
                    <input
                        type="text"
                        {...register("district")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="District"
                    />
                </div>

                {/* State */}
                <div>
                    <input
                        type="text"
                        {...register("state")}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="State"
                    />
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
                    className="bg-primary text-secondary p-2 rounded hover:bg-primary-hover transition"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>
        </div>
    );
};

export default EditOfficeForm;
