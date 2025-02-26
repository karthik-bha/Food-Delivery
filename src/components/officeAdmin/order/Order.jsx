"use client";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { processOrder } from "@/actions/officeAdmin/processOrder";
import { toast } from "react-toastify";

const Order = ({ setOrder, staffData }) => {
    const { vegMeals, nonVegMeals } = staffData;
    const vegMealPrice = 100;
    const nonVegMealPrice = 150;

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { vegMeals, nonVegMeals }
    });

    const watchedVegMeals = watch("vegMeals", vegMeals);
    const watchedNonVegMeals = watch("nonVegMeals", nonVegMeals);

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
    const [showGuestDetails, setShowGuestDetails] = useState(false);

    useEffect(() => {
        getCartData();
    }, []);

    const getCartData = async () => {
        try {
            const response = await axios.get("/api/cart/get?style=order");
            setOrderData(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const additionalTotalPrice = orderData?.additionalItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
    const guestTotalPrice = orderData?.guest_items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

    const calculatedTotalPrice =
        (watchedVegMeals * vegMealPrice) +
        (watchedNonVegMeals * nonVegMealPrice) +
        additionalTotalPrice +
        guestTotalPrice;


        const onSubmit = async (data) => {
            try {
             
                const processedData = await processOrder({
                    vegMeals: data.vegMeals,
                    nonVegMeals: data.nonVegMeals,
                    orderData
                });
        
                // console.log("Processed Data:", processedData); 
        
                // Send request
                const response = await axios.post("/api/order/placeOrder", processedData);          
        
                if (response.data?.success) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data?.message || "Order placement failed");
                }

            } catch (error) {
                // console.error("Order submission failed:", error);
        
                if (error.response) {
                    const { data, status } = error.response;                    
                         
                    if (data?.message) {
                        toast.error(data.message); // Show the exact rejection message
                    } else {
                        toast.error(`Request failed with status ${status}`);
                    }
                } 
            }
        };
        


    if (loading) {
        return (
            <div className="absolute inset-0 bg-black bg-opacity-30 p-6">
                <Loader />
            </div>
        )
    }

    return (
        <div className="absolute inset-0 bg-black bg-opacity-30 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg relative mx-auto w-full max-w-md">
                <button className="absolute top-2 right-4 text-xl"
                    onClick={() => setOrder(false)}>×</button>
                <h2 className="text-xl font-bold mb-4">Order Details</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-medium">Veg Meals (₹{vegMealPrice} each)</label>
                        <input
                            type="number"
                            {...register("vegMeals", { required: "Required", min: { value: 0, message: "Cannot be negative" } })}
                            className="w-full border p-2 rounded"
                        />
                        {errors.vegMeals && <p className="text-red-500 text-sm">{errors.vegMeals.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Non-Veg Meals (₹{nonVegMealPrice} each)</label>
                        <input
                            type="number"
                            {...register("nonVegMeals", { required: "Required", min: { value: 0, message: "Cannot be negative" } })}
                            className="w-full border p-2 rounded"
                        />
                        {errors.nonVegMeals && <p className="text-red-500 text-sm">{errors.nonVegMeals.message}</p>}
                    </div>

                    <div>
                        <p className="font-medium">Additional Items: {orderData?.additionalItems?.length || 0}</p>
                        <p className="text-sm text-gray-600">Price: ₹{additionalTotalPrice}</p>
                        <button type="button" className="underline" onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}>
                            {showAdditionalDetails ? "Hide Details" : "View Details"}
                        </button>
                        {showAdditionalDetails && (
                            <div className="mt-2 border p-2 rounded bg-gray-100">
                                {loading ? <p>Loading...</p> : (
                                    orderData?.additionalItems?.length ? (
                                        <ul>
                                            {orderData.additionalItems.map((item, index) => (
                                                <li key={index} className="text-sm">{item.userName} ordered {item.quantity}x {item.name} (₹{item.price} each)</li>
                                            ))}
                                        </ul>
                                    ) : <p>No additional items ordered.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="font-medium">Guest Items: {orderData?.guest_items?.length || 0}</p>
                        <p className="text-sm text-gray-600">Price: ₹{guestTotalPrice}</p>
                        <button type="button" className="underline" onClick={() => setShowGuestDetails(!showGuestDetails)}>
                            {showGuestDetails ? "Hide Details" : "View Details"}
                        </button>
                        {showGuestDetails && (
                            <div className="mt-2 border p-2 rounded bg-gray-100">
                                {loading ? <p>Loading...</p> : (
                                    orderData?.guest_items?.length ? (
                                        <ul>
                                            {orderData.guest_items.map((guest, index) => (
                                                <li key={index} className="text-sm">{guest.addedByName} ordered {guest.quantity}x {guest.name} (₹{guest.price} each)</li>
                                            ))}
                                        </ul>
                                    ) : <p>No guest items ordered.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-lg font-semibold">Total Price: ₹{calculatedTotalPrice}</div>

                    <button type="submit" className="w-full btn-primary">Submit Order</button>
                </form>
            </div>
        </div>
    );
};

export default Order;
