"use client"
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const SuperAdminRegistration = () => {
    // Initialize the useForm hook
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Submit function that handles the form submission
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post("/api/users/register/super_admin", data);
            console.log(response);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);            
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-4 font-content">
            <h2 className="text-heading">Register Super Admin</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-4 flex flex-col gap-4 p-4 rounded-lg border-2 border-black">
                <div className="flex flex-col">
                    <input id="email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Invalid email address' }
                        })}
                        placeholder="email"
                        className="shadow-md border border-black px-2"
                    ></input>
                    {errors.email && <span className="text-red-500 ">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col">
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        placeholder="password"
                        className="shadow-md border border-black px-2"
                    ></input>
                    {errors.password && <span className="text-red-500 ">{errors.password.message}</span>}
                </div>
                <button type="submit" className="border border-black hover:bg-black hover:text-white">Register</button>
            </form>
        </div>
    )
}

export default SuperAdminRegistration