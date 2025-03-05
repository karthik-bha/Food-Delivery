"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const RestOwnerReg = ({ setFormOpen, setRestaurantOwners, selectedOwner }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: selectedOwner || {}, // Pre-fill form if editing
  });

  const onSubmit = async (data) => {
    try {
      let response;

      if (selectedOwner) {
        // Update existing restaurant owner
        const editId = selectedOwner._id;
        response = await axios.put(`/api/users/update/${editId}`, data);
      } else {
        // Register new restaurant owner
        response = await axios.post("/api/users/register/restaurant_owner", data);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        setRestaurantOwners((prevOwners) => {
          if (!prevOwners) return [response.data.updatedUser || response.data.newRestaurantOwner];

          return selectedOwner
            ? prevOwners.map(owner =>
              owner._id === response.data.updatedUser._id
                ? {
                  ...owner, // Preserve existing populated fields
                  name: response.data.updatedUser.name,
                  phone: response.data.updatedUser.phone,
                  email: response.data.updatedUser.email
                }
                : owner
            )
            : [...prevOwners, response.data.newRestaurantOwner];
        });

        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error during registration/update");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="relative p-4 shadow-default-shadow flex flex-col gap-4">
        <img src="/svgs/cross.svg" className="w-6 h-6 hover:cursor-pointer absolute top-2 right-2"
          onClick={() => setFormOpen(false)} />
        <h2 className="text-sub-heading text-center my-4">
          {selectedOwner ? "Edit Restaurant Owner" : "Register a New Restaurant Owner"}
        </h2>

        {/* Input Fields */}
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

        {/* Password field only for new registration */}
        {!selectedOwner && (
          <>
            <input
              type="password"
              placeholder="Password"
              className="rounded-md p-2"
              {...register("password", { required: "Password is required" })}
            />
            <span className="text-red-500">{errors.password?.message}</span>
          </>
        )}

        <button className="btn-primary">{selectedOwner ? "Update" : "Register"}</button>
      </form>
    </div>
  );
};

export default RestOwnerReg;
