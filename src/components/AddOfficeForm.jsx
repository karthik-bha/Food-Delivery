"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const AddOfficeForm = ({ setAddOfficeForm, officeType, setOffices  }) => {

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            isActive: true,
            state: "",
            district: "",
            street_address: "",
            timeLimit: "", // Only used for RestaurantOffice
        }
    });


    const onSubmit = async (data) => {
        setLoading(true);
        let endpoint = "";
        console.log(data);
        console.log(officeType);
        if (officeType === "AdminOffice") endpoint = `/api/offices/register/adminOffice`;
        else if (officeType === "SmallOffice") endpoint = `/api/offices/register/smallOffice`;
        else if (officeType === "RestaurantOffice") endpoint = `/api/offices/register/restaurantOffice`;

        try {
            const response = await axios.post(endpoint, data);
            console.log(response.data);
            if (response.data.success) {
                toast.success("Office added successfully!");
                setOffices(prevOffices => [...prevOffices, response.data.newOffice]);
                
            } else {
                console.log(response);
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data);
        } finally {
            setLoading(false);
            setAddOfficeForm(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto my-4">
            <div className="flex justify-between my-4">
                <h2 className="text-sub-heading font-sub-heading">Create Office</h2>
                <button className="btn-primary cursor-pointer" onClick={() => setAddOfficeForm(false)}
                >x</button>
            </div>

            <h3 className="text-center text-[1.3rem] p-4 ">Add a<b> {officeType}</b></h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Common Fields */}
                <input className="w-full border p-2 rounded-md mb-2" type="text" placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <input className="w-full border p-2 rounded-md mb-2" type="text" placeholder="Phone"
                    {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                <input className="w-full border p-2 rounded-md mb-2" type="email" placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                {officeType !== "SmallOffice" && officeType !== "RestaurantOffice" &&
                    <>
                        <input className="w-full border p-2 rounded-md mb-2" type="text" placeholder="State"
                            {...register("state", { required: "State is required" })}
                        />
                        {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

                        <input className="w-full border p-2 rounded-md mb-2" type="text" placeholder="District"
                            {...register("district", { required: "District is required" })}
                        />
                        {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                    </>
                }


                <input className="w-full border p-2 rounded-md mb-2" type="text" placeholder="Street Address" {...register("street_address", { required: "Street Address is required" })} />
                {errors.street_address && <p className="text-red-500 text-sm">{errors.street_address.message}</p>}

                {/* timeLimit Field (Only for RestaurantOffice) */}
                {officeType === "RestaurantOffice" && (
                    <>
                        <input {...register("timeLimit")}
                            placeholder="e.g., 09:45 AM (12-hour format)" className="border p-2 rounded w-full mb-2" />
                    </>
                )}

                {/* Submit Button */}
                <button type="submit" className={`btn-primary w-full ${loading ? "disabled:cursor-not-allowed" : ""}`}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddOfficeForm;
