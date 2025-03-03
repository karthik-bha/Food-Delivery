"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddMenu = ({ setFormOpen }) => {
    // Separate forms
    const regularMenuForm = useForm({
        defaultValues: {
            day: "Monday",
            Theme: "",
            Veg: "",
            NonVeg: "",
        },
    });

    const additionalMenuForm = useForm({
        defaultValues: {
            additionalMenu: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: additionalMenuForm.control,
        name: "additionalMenu",
    });

    const selectedDay = regularMenuForm.watch("day");
    const [loading, setLoading] = useState(false);

    // Handle Regular Menu Submission
    const onSubmitRegularMenu = async (data) => {
        setLoading(true);
        try {
            const payload = {
                regularItem: {
                    [data.day]: { Theme: data.Theme, Veg: data.Veg, NonVeg: data.NonVeg },
                },
            };
            const response = await axios.post("/api/menu/register", payload);
            toast.success(response.data.message);
            setFormOpen(false);
            regularMenuForm.reset();
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle Additional Menu Submission
    const onSubmitAdditionalMenu = async (data) => {
        setLoading(true);
        try {
            const filteredAdditionalMenu = data.additionalMenu.filter(
                (item) => item.name.trim() && item.price
            );

            const payload = {
                additionalMenu: filteredAdditionalMenu.length > 0 ? filteredAdditionalMenu : [],
            };

            const response = await axios.post("/api/menu/register", payload);
            toast.success(response.data.message);
            setFormOpen(false);
            additionalMenuForm.reset();
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
                <form onSubmit={regularMenuForm.handleSubmit(onSubmitRegularMenu)} className="bg-gray-100 p-4 rounded-md shadow w-full max-w-sm mx-auto">
                    <h3 className="text-lg font-medium mb-2">{selectedDay} Menu</h3>
                     
                    <div className="flex gap-4 items-center mb-4">
                        <label className="font-medium">Select Day</label>
                        <select {...regularMenuForm.register("day")} className="border p-2 rounded w-full">
                            {days.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <input type="text" placeholder="Theme of the Day" {...regularMenuForm.register("Theme",{required:true})} className="border p-2 rounded w-full" />
                    <input type="text" placeholder="Veg dish" {...regularMenuForm.register("Veg",{required:true})} className="border p-2 rounded w-full mt-2" />
                    <input type="text" placeholder="Non-Veg dish" {...regularMenuForm.register("NonVeg",{required:true})} className="border p-2 rounded w-full mt-2" />

                    <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Regular Menu"}
                    </button>
                </form>

                {/* Additional Menu Form */}
                <form onSubmit={additionalMenuForm.handleSubmit(onSubmitAdditionalMenu)} className="bg-gray-100 p-4 rounded-md shadow w-full max-w-sm mx-auto">
                    <h3 className="text-lg font-medium mb-2">Additional Menu</h3>

                    {fields.map((item, index) => (
                        <div key={item.id} className="border p-3 rounded mt-2 flex flex-col">
                            <input type="text" placeholder="Name" {...additionalMenuForm.register(`additionalMenu.${index}.name`, { required: true })} className="border p-2 rounded " />
                            <input type="number" placeholder="Price" {...additionalMenuForm.register(`additionalMenu.${index}.price`, { required: true })} className="border p-2 rounded mt-2" />
                            <input type="text" placeholder="Image URL (optional)" {...additionalMenuForm.register(`additionalMenu.${index}.image_url`)} className="border p-2 rounded mt-2" />
                            <textarea placeholder="Description (optional)" {...additionalMenuForm.register(`additionalMenu.${index}.description`)} className="border p-2 rounded mt-2"></textarea>
                            <button type="button" onClick={() => remove(index)} className="text-red-500 mt-2">Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={() => append({ name: "", price: "", image_url: "", description: "" })} className=" mt-2">
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
