"use client"

import { useForm } from "react-hook-form";
const OfficeAdminReg = ({formOpen, setFormOpen}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = () => {
    console.log(data);
  }
  return (
    <div>
      <h2 className="text-sub-heading text-center my-4">Register a new Office Admin</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="relative p-4 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] flex flex-col gap-4 ">
        <p className="absolute top-0 right-0 cursor-pointer" onClick={()=>setFormOpen(false)}>X</p>
        <input
          type="text"
          placeholder="Name"
          className="rounded-md p-2 "
          {...register("name", { required: true, errors: "Name is required" })}
        />
        <span>{errors.name?.message}</span>
        <input
        type="text"
        placeholder="Phone"
        className="rounded-md p-2"
        {...register("phone", { required: true, errors: "Phone is required" })}
        />
        <input 
        type="email"
        placeholder="Email"
        className="rounded-md p-2 "
        {...register("email", { required: true, errors: "Email is required" })}
        />
        <input
        type="password"
        placeholder="Password"
        className="rounded-md p-2 "
        {...register("password", { required: true, errors: "Password is required" })}
        />

        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md">Register</button>
      </form>
      
    </div>
  )
}

export default OfficeAdminReg