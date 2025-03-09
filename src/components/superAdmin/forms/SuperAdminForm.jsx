import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const SuperAdminForm = ({ editUser }) => {
    const { register, handleSubmit, setValue, reset } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editUser) {
            setIsEditing(true);
            setValue("name", editUser.name);
            setValue("email", editUser.email);
            setValue("phone", editUser.phone);
        } else {
            setIsEditing(false);
            reset();
        }
    }, [editUser, setValue, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let url = isEditing
                ? `/api/users/update/${editUser._id}`
                : "/api/users/register/super_admin";

            let response;
            if (isEditing) {
                response = await axios.put(url, { ...data, type: "superAdmin" });
            } else {
                response = await axios.post(url, data);
            }

            toast.success(response.data.message);
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-w-[20vw] bg-white p-6 rounded-lg shadow-default-shadow my-6 flex flex-col gap-4"
        >
            <div>

                <input
                    type="text"
                    {...register("name", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                />
            </div>

            <div>

                <input
                    type="email"
                    {...register("email", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                />
            </div>

            <div>

                <input
                    type="text"
                    {...register("phone", { required: true })}
                    className="mt-1 p-2 w-full border rounded-md"
                />
            </div>

            {isEditing && (
                <p
                    className="mt-2 cursor-pointer text-sm font-bold"
                    onClick={() => setResetPassword(!resetPassword)}
                >
                    Change Password?
                </p>
            )}

            {resetPassword && (
                <div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { minLength: 6 })}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="New Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 px-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters.</p>
                </div>
            )}

            <button type="submit" className="w-full btn-primary mt-4">
                {isEditing ? "Update Super Admin" : "Create Super Admin"}
            </button>
        </form>
    );
};

export default SuperAdminForm;
