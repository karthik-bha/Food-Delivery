"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "@/components/Loader";

const inputFields = [
    { name: "name", type: "text", placeholder: "Name", validation: { required: "Name is required" } },
    { name: "phone", type: "text", placeholder: "Phone", validation: { required: "Phone number is required" } },
    { name: "email", type: "email", placeholder: "Email", validation: { required: "Email is required" } },
    { name: "password", type: "password", placeholder: "Password", validation: { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } } },
];

const AddStaffForm = ({ setOpenForm, setStaffData, staffData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    // Function to handle form submission
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/register/office_staff", data);
            const fetchedData = response.data;

            if (response.data.success) {
                toast.success(response.data.message);
                setOpenForm(false);
                setStaffData([...staffData, fetchedData.newStaff]);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error during registering");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <Loader />
    }

    return (
        <div className="  md:w-[25vw] p-6 flex flex-col items-center relative shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] my-12">
            {/* Close button */}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg w-full flex flex-col gap-4 ">
                {/* Form Title */}

                {/* <div className="flex gap-2 items-center"> */}
                    <h2 className="text-sub-heading font-semibold text-center">Register a new office staff</h2>
                    <button className="btn-primary absolute top-2 right-2"
                        onClick={() => setOpenForm(false)}>x</button>

                {/* </div> */}

                {/* Input Fields */}
                {inputFields.map(({ name, type, placeholder, validation }) => (
                    <div key={name}>
                        <input
                            type={type}
                            {...register(name, validation)}
                            className="w-full p-2 border rounded mt-1"
                            placeholder={placeholder}
                        />
                        {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
                    </div>
                ))}

                {/* Meal Preference Dropdown */}
                <div>
                    <label className="block text-sm font-medium">Meal Preference</label>
                    <select
                        {...register("isVeg", { required: "Please select a meal preference" })}
                        className="w-full p-2 border rounded mt-1"
                        defaultValue={true}
                    >
                        <option value={true}>Veg</option>
                        <option value={false}>Non-Veg</option>
                    </select>
                    {errors.isVeg && <p className="text-red-500 text-sm">{errors.isVeg.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddStaffForm;
