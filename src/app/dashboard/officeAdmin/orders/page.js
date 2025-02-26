"use client";

import { fetchProcessedOrders } from "@/actions/officeAdmin/fetchProcessedOrders";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [processedOrders, setProcessedOrders] = useState({ todayOrders: {}, previousOrders: {} });
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState({});
    const [showToday, setShowToday] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch orders on load
    async function fetchOrders() {
        try {
            const response = await axios.get("/api/order/get");
            const fetchedData = response.data;
            const processedData = await fetchProcessedOrders(fetchedData.orders);
            setProcessedOrders(processedData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }

    // Toggle "View Details" for a specific order
    const toggleShowMore = (orderId) => {
        setShowMore((prev) => ({
            ...prev,
            [orderId]: !prev[orderId], // Toggle showMore state for each order
        }));
    };

    const ordersToDisplay = showToday ? processedOrders.todayOrders : processedOrders.previousOrders;

    return (
        <div>
            <h2 className="text-section-heading my-12">Office Orders</h2>

            <select 
                className="p-2 border rounded-md mb-4"
                value={showToday ? "true" : "false"}
                onChange={(e) => setShowToday(e.target.value === "true")}
            >
                <option value="true">Today's Orders</option>
                <option value="false">Previous Orders</option>
            </select>

            <div className="grid md:grid-cols-4 p-2 text-center bg-primary rounded-t-md text-white">
                <p>Veg Meals</p>
                <p>Non Veg Meals</p>
                <p>Additional Meals Count</p>
                <p>Grand Total</p>
            </div>

            {loading && <Loader />}
            {ordersToDisplay && Object.keys(ordersToDisplay).length === 0 && <p>No orders found</p>}

            <div className="border-r border-l border-black">
                {Object.values(ordersToDisplay).map((order) => {
                    const orderId = order.orderId;
                    return (
                        <div key={orderId} className="border-b text-center border-black grid md:grid-cols-4 gap-4 p-2">
                            <p>{order.NumberOfVeg}</p>
                            <p>{order.NumberOfNonVeg}</p>

                            {/* Additional Meals Count + View Details */}
                            <p
                                className="flex text-center hover:cursor-pointer mx-auto gap-2"
                                onClick={() => toggleShowMore(orderId)}
                            >
                                {order.additionalOrders.length}
                                <span className="underline ">{showMore[orderId] ? "Hide Details" : "View Details"}</span>
                            </p>

                            <p>{order.TotalAmount}</p>

                            {/* Show additional order details when expanded */}
                            {showMore[orderId] && order.additionalOrders.length > 0 && (
                                <div className="col-span-4 text-left p-2 bg-gray-100 rounded-md">
                                    <h3 className="font-bold">Additional Orders:</h3>
                                    <ul className="list-disc pl-5">
                                        {order.additionalOrders.map((detail, index) => (
                                            <li key={index}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Page;
