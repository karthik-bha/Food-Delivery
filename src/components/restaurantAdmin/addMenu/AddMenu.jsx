"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AddMenu = ({ setFormOpen, setMenuData }) => {
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: {
            day: "Monday",
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
            // Filter out empty additional menu items
            const filteredAdditionalMenu = data.additionalMenu.filter(
                (item) => item.name.trim() && item.price
            );

            // Construct request payload
            const payload = {
                additionalMenu: filteredAdditionalMenu.length > 0 ? filteredAdditionalMenu : [],
            };

            // Add regularItem only if Veg or NonVeg is filled
            if (data.Veg.trim() || data.NonVeg.trim()) {
                payload.regularItem = {
                    [data.day]: { Veg: data.Veg, NonVeg: data.NonVeg },
                };
            }
            console.log(payload);
            const response = await axios.post("/api/menu/register", payload);

            toast.success(response.data.message);
            setFormOpen(false);
            reset({ day: "Monday", Veg: "", NonVeg: "", additionalMenu: [] });
        } catch (err) {
            toast.error(response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-md relative">
            {/* Close Button */}
            <button className="absolute top-2 right-4 text-xl font-semibold" onClick={() => setFormOpen(false)}>
                ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Add/Edit Menu</h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Day Selection */}
                <div>
                    <label className="font-medium">Select Day</label>
                    <select {...register("day")} className="border p-2 rounded w-full">
                        {days.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Veg & Non-Veg Input */}
                <div>
                    <label className="font-medium">{selectedDay} Menu (Optional)</label>
                    <input type="text" placeholder="Veg dish" {...register("Veg")} className="border p-2 rounded w-full" />
                    <input type="text" placeholder="Non-Veg dish" {...register("NonVeg")} className="border p-2 rounded w-full mt-2" />
                </div>

                {/* Additional Menu Items (Dynamic Fields) */}
                <div>
                    <label className="font-medium">Additional Menu</label>
                    {fields.map((item, index) => (
                        <div key={item.id} className="border p-3 rounded mt-2">
                            <input type="text" placeholder="Name" {...register(`additionalMenu.${index}.name`, { required: true })} className="border p-2 rounded w-full" />
                            <input type="number" placeholder="Price" {...register(`additionalMenu.${index}.price`, { required: true })} className="border p-2 rounded w-full mt-2" />
                            <input type="text" placeholder="Image URL (optional)" {...register(`additionalMenu.${index}.imageUrl`)} className="border p-2 rounded w-full mt-2" />
                            <textarea placeholder="Description (optional)" {...register(`additionalMenu.${index}.description`)} className="border p-2 rounded w-full mt-2"></textarea>
                            <button type="button" onClick={() => remove(index)} className="text-red-500 mt-2">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ name: "", price: "", imageUrl: "", description: "" })} className="text-primary mt-2 mx-2">
                        + Add Item
                    </button>
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Menu"}
                </button>
            </form>
        </div>
    );
};

export default AddMenu;
