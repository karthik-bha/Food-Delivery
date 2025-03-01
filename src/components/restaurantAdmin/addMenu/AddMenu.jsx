"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddMenu = ({ setFormOpen }) => {
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: {
            day: "Monday",
            Theme: "",
            Veg: "",
            NonVeg: "",
            additionalMenu: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "additionalMenu",
    });

    const selectedDay = watch("day");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const filteredAdditionalMenu = data.additionalMenu.filter(
                (item) => item.name.trim() && item.price
            );

            const payload = {
                additionalMenu: filteredAdditionalMenu.length > 0 ? filteredAdditionalMenu : [],
            };

            if (data.Veg.trim() || data.NonVeg.trim()) {
                payload.regularItem = {
                    [data.day]: { Theme: data.Theme, Veg: data.Veg, NonVeg: data.NonVeg },
                };
            }

            const response = await axios.post("/api/menu/register", payload);

            toast.success(response.data.message);
            setFormOpen(false);
            reset({ day: "Monday", Theme: "", Veg: "", NonVeg: "", additionalMenu: [] });
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-md p-6 relative max-w-4xl mx-auto">
            {/* Close Button */}
            <h2 className="text-xl font-semibold mb-4">Add/Edit Menu</h2>
            <button className="btn-primary absolute top-2 right-2" onClick={() => setFormOpen(false)}>x</button>

            {/* Grid Layout for Two Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Regular Menu Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 rounded-md shadow w-full max-w-sm mx-auto">
                    <h3 className="text-lg font-medium mb-2">{selectedDay} Menu</h3>
                    
                    <div className="flex gap-4 items-center mb-4">
                        <label className="font-medium">Select Day</label>
                        <select {...register("day")} className="border p-2 rounded w-full">
                            {days.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <input type="text" placeholder="Theme of the Day" {...register("Theme")} className="border p-2 rounded w-full" />
                    <input type="text" placeholder="Veg dish" {...register("Veg")} className="border p-2 rounded w-full mt-2" />
                    <input type="text" placeholder="Non-Veg dish" {...register("NonVeg")} className="border p-2 rounded w-full mt-2" />

                    <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Regular Menu"}
                    </button>
                </form>

                {/* Additional Menu Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 rounded-md shadow w-full max-w-sm mx-auto">
                    <h3 className="text-lg font-medium mb-2">Additional Menu</h3>

                    {fields.map((item, index) => (
                        <div key={item.id} className="border p-3 rounded mt-2 flex flex-col">
                            <input type="text" placeholder="Name" {...register(`additionalMenu.${index}.name`, { required: true })} className="border p-2 rounded " />
                            <input type="number" placeholder="Price" {...register(`additionalMenu.${index}.price`, { required: true })} className="border p-2 rounded mt-2" />
                            <input type="text" placeholder="Image URL (optional)" {...register(`additionalMenu.${index}.imageUrl`)} className="border p-2 rounded mt-2" />
                            <textarea placeholder="Description (optional)" {...register(`additionalMenu.${index}.description`)} className="border p-2 rounded mt-2"></textarea>
                            <button type="button" onClick={() => remove(index)} className="text-red-500 mt-2">Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={() => append({ name: "", price: "", imageUrl: "", description: "" })} className="text-primary mt-2">
                        + Add Item
                    </button>

                    <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Additional Menu"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AddMenu;
