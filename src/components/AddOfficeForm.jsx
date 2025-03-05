"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const AddOfficeForm = ({ linkedUserId, linkedUserName, setAddOfficeForm, officeType }) => {
 
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
        let endpoint = "";
        console.log(data);
        console.log(officeType);
        if (officeType === "AdminOffice") endpoint = `/api/offices/register/adminOffice/${linkedUserId}`;
        else if (officeType === "SmallOffice") endpoint = `/api/offices/register/smallOffice/${linkedUserId}`;
        else if (officeType === "RestaurantOffice") endpoint = `/api/offices/register/restaurantOffice/${linkedUserId}`;
        
        try {
            const response = await axios.post(endpoint, data);
            if (response.data.success) {
                toast.success("Office added successfully!");
            } else {
                console.log(response);
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
            <div className="flex justify-between my-4">
                <h2 className="text-sub-heading font-sub-heading">Create Office</h2>
                <button className="btn-primary cursor-pointer" onClick={() => setAddOfficeForm(false)}
                >x</button>
            </div>

            <h3 className="text-center text-[1.3rem] p-4 ">Add a<b> {officeType} </b>to <b>{linkedUserName}</b></h3>

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
                
            {officeType !== "SmallOffice" && officeType!=="RestaurantOffice" &&
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
                        <input className="w-full border p-2 rounded-md mb-2" type="text"
                            placeholder="Time Limit" {...register("timeLimit")} />
                    </>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn-primary w-full">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddOfficeForm;

// const [officeType, setOfficeType] = useState("AdminOffice"); // Default selection
{/* Office Type Selection */ }
{/* <label className="block mb-2 font-semibold">Select Office Type:</label>
            <select
                className="w-full border p-2 rounded-md mb-4"
                onChange={(e) => setOfficeType(e.target.value)}
                value={officeType}
            >
                <option value="AdminOffice">Admin Office</option>
                <option value="SmallOffice">Small Office</option>
                <option value="RestaurantOffice">Restaurant Office</option>
            </select> */}