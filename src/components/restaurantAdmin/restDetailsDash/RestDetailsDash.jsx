"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"

// Form component
const EditForm = ({ data, onClose, onUpdate }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: data });

    const onSubmit = async (formData) => {
        try {
            console.log(formData);
            await axios.put("/api/offices/update/pvt/RestaurantOffice", formData);
            onUpdate(formData);
            toast.success("Updated successfully, Refresh page");
            onClose();
        } catch {
            toast.error("Update failed");            
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative p-6 border rounded-lg shadow-lg w-[90%] max-w-md mx-auto bg-white">
            {/* Close Button */}
            <button type="button" onClick={onClose} className="absolute top-3 right-4 text-xl font-semibold cursor-pointer">×</button>
            <h2 className="text-lg font-semibold mb-4 text-center">Edit Restaurant Details</h2>

            {/* Input Fields with Placeholders */}
            <input {...register("name", { required: "Name is required" })} placeholder="Name" className="border p-2 rounded w-full mb-2" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <input {...register("phone", { required: "Phone number is required" })} placeholder="Phone" className="border p-2 rounded w-full mb-2" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

            <input {...register("email", { required: "Email is required" })} placeholder="Email" className="border p-2 rounded w-full mb-2" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input {...register("street_address", { required: "Street address is required" })} placeholder="Street Address" className="border p-2 rounded w-full mb-2" />
            {errors.street_address && <p className="text-red-500 text-sm">{errors.street_address.message}</p>}

            <input {...register("district", { required: "District is required" })} placeholder="District" className="border p-2 rounded w-full mb-2" />
            {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}

            <input {...register("state", { required: "State is required" })} placeholder="State" className="border p-2 rounded w-full mb-2" />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

            <input {...register("timeLimit")} placeholder="Close Time, Format (HH:MM), 24 hour format" className="border p-2 rounded w-full mb-2" />

            {/* Status Dropdown */}
            <select {...register("isActive", { required: "Status is required" })} className="border p-2 rounded w-full mb-4">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">Save</button>
        </form>
    );
};


// Main component (card component and controls form open)
const RestDetailsDash = () => {
    const [restaurantData, setRestaurantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openEditForm, setOpenEditForm] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get("/api/offices/get/RestaurantOffice");
                setRestaurantData(data.officeDetails);
                toast.success(data.message);
            } catch {
                toast.error("Failed to fetch restaurant data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex h-[60vh] md:w-[20vw] w-screen justify-center items-center "><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div></div>;
    }

    return openEditForm ? (
        <EditForm data={restaurantData} onClose={() => setOpenEditForm(false)} onUpdate={setRestaurantData} />
    ) : (
        <div className="shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] md:w-[20vw]">
            <div className="bg-primary text-secondary rounded-t-md px-4 py-2">
                <h2 className="text-sub-heading">Restaurant details</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <p><b>Name: </b><span>{restaurantData?.name}</span></p>
                <p><b>Phone:</b> <span>{restaurantData?.phone}</span></p>
                <p><b>Email:</b> <span>{restaurantData?.email}</span></p>
                <p><b>Address:</b></p>
                <div className="px-4">
                    <p>{restaurantData?.street_address}</p>
                    <p>{restaurantData?.district}</p>
                    <p>{restaurantData?.state}</p>
                </div>
                <p><b>Status: </b><span className={restaurantData?.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{restaurantData?.isActive ? "Active" : "Inactive"}</span></p>
                <p><b>Close time: </b><span>{restaurantData?.timeLimit}</span></p>
                <div className="flex mx-auto">
                    <button className="bg-primary hover:bg-primary-hover rounded-lg text-white px-4 py-2" onClick={() => setOpenEditForm(true)}>Edit details</button>
                </div>
            </div>
        </div>
    );
};

export default RestDetailsDash;
