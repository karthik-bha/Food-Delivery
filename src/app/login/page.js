"use client"
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const[showPass, setShowPass]=useState(false);
    // Initialize the useForm hook
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router=useRouter();
    // Submit function that handles the form submission
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post("/api/login", data);
            console.log(response);
            // localStorage.setItem("token", response.data.token);

            toast.success(response.data.message);
            console.log(response.data.redirect);
            window.location.href = response.data.redirect;
        } catch (error) {
            toast.error(error.response.data.message);            
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
      <div className="text-center bg-white py-6 rounded-md shadow-[0_0_15px_10px_rgba(0,0,0,0.1)]">
            <h2 className="text-login-heading text-heading font-bold">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-4 flex flex-col gap-4 p-4 rounded-lg">
                <div className="flex flex-col">
                    <input id="email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 
                                message: 'Invalid email address' }
                        })}
                        placeholder="email"
                        className="shadow-md border border-gray-300 px-2 py-1"
                    ></input>
                    {errors.email && <span className="text-red-500  text-form-error">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col">
                    <div className="relative">
                    <input
                        id="password"
                        type={`${showPass? "text":"password"}`}
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        placeholder="password"
                        className="shadow-md border border-gray-300 px-2 py-1"
                       
                    ></input>
                    {showPass?  <img src="/svgs/login/eye.svg" className="absolute right-2 
                    top-[0.7rem] hover:cursor-pointer"  width={15}
                    onClick={()=>setShowPass(false)}/>
                    :
                     <img src="/svgs/login/eye-slash.svg" className="absolute right-2 
                     top-[0.7rem] hover:cursor-pointer"  width={15}
                     onClick={()=>setShowPass(true)}/>}
                   
                    </div>
                    {errors.password && <span className="text-red-500 text-form-error ">{errors.password.message}</span>}
                </div>
                <button type="submit" className="font-button-text bg-primary text-white
                rounded-md hover:bg-primary-hover   py-2
                ">Login</button>
            </form>
            </div>
        </div>
    )
}

export default Login