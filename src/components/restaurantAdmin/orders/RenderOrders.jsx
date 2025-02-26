"use client";

import { useState } from "react";

const RenderOrders = ({ todayOrders, previousOrders }) => {
    const [expanded, setExpanded] = useState({});
    const [showTodayOrders, setShowTodayOrders] = useState(true);  

    const toggleExpand = (orderId) => {
        setExpanded((prev) => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Select orders based on state
    const ordersToDisplay = showTodayOrders ? todayOrders : previousOrders;

    return (
        <div className="my-6 p-4">
            {/* Dropdown to switch between Today's Orders and Previous Orders */}
            <div className="mb-4">
                <select
                    className="p-2 border rounded-md"
                    value={showTodayOrders ? "today" : "previous"}
                    onChange={(e) => setShowTodayOrders(e.target.value === "today")}
                >
                    <option value="today">Today's Orders</option>
                    <option value="previous">Previous Orders</option>
                </select>
            </div>

            {/* Orders rendering */}
            <h2 className="text-lg font-bold mb-4">{showTodayOrders ? "Today's Orders" : "Previous Orders"}</h2>

            <div className="hidden md:grid grid-cols-5 bg-primary p-2 rounded-t-md text-secondary text-center">
                <p>Office Name</p>
                <p>Number of Veg</p>
                <p>Number of NonVeg</p>
                <p>Additional Items</p>
                <p>Total Amount</p>
            </div>

            {ordersToDisplay.map((order) => (
               
                <div key={order.id} className="border-b py-4">
                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-5 text-center p-2">
                        <p>{order.officeName}</p>
                        <p>{order.numberOfVeg}</p>
                        <p>{order.numberOfNonVeg}</p>
                       
                        <p
                            className="cursor-pointer underline"
                            onClick={() => toggleExpand(order._id)}
                        >
                          {expanded[order._id] ? "Hide" : "View"}  Additional Items
                        </p>

                        <p>{order.totalAmount}</p>
                    </div>

                    {/* Mobile layout */}
                    <div className="sm:hidden flex flex-col gap-2 p-2 border rounded-md bg-gray-100">
                        <p><strong>Office:</strong> {order.officeName}</p>
                        <p><strong>Veg:</strong> {order.numberOfVeg}</p>
                        <p><strong>Non-Veg:</strong> {order.numberOfNonVeg}</p>
                        <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                        <button
                            onClick={() => toggleExpand(order._id)}
                            className="underline text-sm"
                        >
                            {expanded[order._id] ? "Hide" : "View"} Additional Items
                        </button>

                    </div>

                    {/* Expandable Section for Additional Items */}
                    {expanded[order._id] && (
                        <div key={order.id} className="mt-2 p-2 bg-white border rounded-md">
                            <p className="text-sm font-semibold">Additional Booked Items:</p>
                            <p className="text-sm text-gray-700">
                                {order.additionalBookedItems.concat(", "+order.guestBookedItems)}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RenderOrders;
