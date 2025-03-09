"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const OfficeEditForm = ({ selectedOfficeData, setOfficeData, officeType, setEditOffice }) => {
    
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: selectedOfficeData
    });

    // Function to convert 24-hour time to 12-hour format with AM/PM
    const convertTo12HourFormat = (time) => {
        if (!time) return "";
        let [hours, minutes] = time.split(":").map(Number);
        let period = "AM";

        if (hours >= 12) {
            period = "PM";
            if (hours > 12) hours -= 12;
        } else if (hours === 0) {
            hours = 12; // Midnight case
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    // Convert `timeLimit` to 12-hour format when component loads
    useEffect(() => {
        if (selectedOfficeData?.timeLimit) {
            setValue("timeLimit", convertTo12HourFormat(selectedOfficeData.timeLimit));
        }
    }, [selectedOfficeData, setValue]);

    async function onSubmit(updatedData) {
        setLoading(true);
        try {
            const endpoint =
                officeType === "SmallOffice"
                    ? `/api/offices/update/pvt/SmallOffice`
                    : officeType === "AdminOffice"
                    ? `/api/offices/update/pvt/AdminOffice`
                    : `/api/offices/update/pvt/RestaurantOffice`;

            const response = await axios.put(endpoint, updatedData);

            if (response.data.success) {
                toast.success(response.data.message);

                // Update office data in state
                setOfficeData(prevOffices =>
                    prevOffices.map(office =>
                        office._id === selectedOfficeData._id ? { ...office, ...updatedData } : office
                    )
                );

                setEditOffice(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />;

    return (
        <div className="min-w-[20vw] relative p-6 border rounded-md bg-white shadow-default-shadow">
            <h2 className="text-sub-heading font-sub-heading mb-4">Edit {officeType}</h2>
            <img
                src="/svgs/cross.svg"
                className="cursor-pointer w-6 h-6 absolute top-2 right-2"
                onClick={() => setEditOffice(false)}
                alt="Close"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="input-field"
                        placeholder="Name"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="input-field"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        {...register("phone", { required: "Phone number is required" })}
                        className="input-field"
                        placeholder="Phone"
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        {...register("street_address", { required: "Address is required" })}
                        className="input-field"
                        placeholder="Address"
                    />
                    {errors.street_address && <p className="text-red-500">{errors.street_address.message}</p>}
                </div>

                {/* Additional fields for AdminOffice */}
                {officeType === "AdminOffice" && (
                    <>
                        <div>
                            <input
                                type="text"
                                {...register("state", { required: "State is required" })}
                                className="input-field"
                                placeholder="State"
                            />
                            {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                {...register("district", { required: "District is required" })}
                                className="input-field"
                                placeholder="District"
                            />
                            {errors.district && <p className="text-red-500">{errors.district.message}</p>}
                        </div>
                    </>
                )}

                {/* Only show timeLimit field for Restaurants */}
                {officeType === "Restaurant" && (
                    <div>
                        <input
                            type="text"
                            {...register("timeLimit", {
                                required: "Time limit is required",
                                pattern: {
                                    value: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
                                    message: "Invalid time format (e.g., 09:45 AM)"
                                }
                            })}
                            placeholder="e.g., 09:45 AM (12-hour format)"
                            className="input-field"
                        />
                        {errors.timeLimit && <p className="text-red-500">{errors.timeLimit.message}</p>}
                    </div>
                )}

                <div className="flex gap-4">
                    <button type="submit" className="btn-primary w-full">Save</button>
                </div>
            </form>
        </div>
    );
};

export default OfficeEditForm;
