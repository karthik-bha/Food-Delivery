"use client"

import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const RestOwnerReg = ({ setFormOpen, setRestaurantOwners,restaurantOwners }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await axios.post("/api/users/register/restaurant_owner", data);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setRestaurantOwners(prevAdmins => [...(prevAdmins || []), response.data. newRestaurantOwner]);
        setFormOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error during registering");
    }
  };

  return (
    <div className="">

      <form onSubmit={handleSubmit(onSubmit)} className="relative p-4 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] flex flex-col gap-4">

        <p className="absolute top-2 right-4 text-xl font-semibold cursor-pointer"
          onClick={() => setFormOpen(false)}>x</p>
        <h2 className="text-sub-heading text-center my-4">Register a new Restaurant Owner</h2>


        <input
          type="text"
          placeholder="Name"
          className="rounded-md p-2"
          {...register("name", { required: "Name is required" })}
        />
        <span className="text-red-500">{errors.name?.message}</span>

        <input
          type="text"
          placeholder="Phone"
          className="rounded-md p-2"
          {...register("phone", { required: "Phone is required" })}
        />
        <span className="text-red-500">{errors.phone?.message}</span>

        <input
          type="email"
          placeholder="Email"
          className="rounded-md p-2"
          {...register("email", { required: "Email is required" })}
        />
        <span className="text-red-500">{errors.email?.message}</span>

        <input
          type="password"
          placeholder="Password"
          className="rounded-md p-2"
          {...register("password", { required: "Password is required" })}
        />
        <span className="text-red-500">{errors.password?.message}</span>

        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md">Register</button>
      </form>
    </div>
  );
};

export default RestOwnerReg;
