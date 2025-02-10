"use client"
import { useForm } from "react-hook-form"
import axios from "axios";
import { toast } from "react-toastify";
const OfficeAdminForm = ({ setOpenForm }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        // console.log(data);
        try {
            const response = await axios.post("/api/users/register/office_staff", data);
            console.log(response);
            toast.success(response.data.message);
            setOpenForm(false);
        } catch (err) {
            console.error("Error:", err);
            if (err.response) {
                // Check if an unauthorized user was trying to access a protected route
                if (err.response.status === 401) {
                    toast.error("Unauthorized! Please check your credentials.");
                } else {
                    toast.error(`Error: ${err.response.data.message || "Something went wrong!"}`);
                }
            } 
        }
    };



    return (
        <div className="relative shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] my-12">
            <button className="absolute top-2 right-2 text-[0.9rem] text-button-bg hover:text-button-hover-bg"
                onClick={() => setOpenForm(false)}>X</button>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 max-w-[80vw] rounded-lg shadow-lg flex flex-col gap-4 w-80"
            >
                <h2 className="text-nav-heading  font-semibold text-center">Register a new office staff</h2>
                {/* Name input  */}
                <div>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                {/* Phone input  */}
                <div>
                    <input
                        type="text"
                        {...register("phone", { required: "Phone number is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                <div>
                    <input
                        type="password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="password"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

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
                    {errors.meal && <p className="text-red-500 text-sm">{errors.meal.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-primary  text-secondary p-2 rounded 
                    hover:bg-primary-hover transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default OfficeAdminForm;