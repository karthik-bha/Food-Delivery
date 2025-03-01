"use client";

import { useEffect, useState } from "react";

const RenderOrders = ({ todayOrders, previousOrders, todaysMenu, allDaysMenu }) => {
    const [expanded, setExpanded] = useState({});
    const [showTodayOrders, setShowTodayOrders] = useState(true);

    useEffect(() => {
        const initialExpandedState = {};
        const orders = showTodayOrders ? todayOrders : previousOrders;
        orders.forEach(order => {
            initialExpandedState[order.id] = true;
        });
        setExpanded(initialExpandedState);
    }, [todayOrders, previousOrders, showTodayOrders]);

    const toggleExpand = (orderId) => {
        setExpanded((prev) => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Convert order date to day name
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
    };

    // Showing the orders based on state and then sorting them to show recent dates first
    const ordersToDisplay = [...(showTodayOrders ? todayOrders : previousOrders)]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    return (
        <div className="my-6 p-4">
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

            <h2 className="text-lg font-bold mb-4">{showTodayOrders ? "Today's Orders" : "Previous Orders"}</h2>

            <div className="hidden md:grid grid-cols-6 bg-primary p-2 rounded-t-md text-secondary text-center">
                <p>Order Date</p>
                <p>Office Name</p>
                <p>Veg Items</p>
                <p>Non-Veg Items</p>
                <p>Additional Items</p>
                <p>Total Amount</p>
            </div>

            {ordersToDisplay.map((order) => {
                const dayName = getDayName(order.orderDate);
                const menuForDay = showTodayOrders ? todaysMenu : allDaysMenu?.menu?.regularItem?.[dayName];

                return (
                    <div key={order.id} className="border-b py-4">
                        <div className="hidden sm:grid grid-cols-6 text-center p-2 gap-4">
                            <p>{order.orderDate}</p>
                            <p>{order.officeName}</p>
                            <p>{order.numberOfVeg} x {menuForDay?.Veg || "N/A"}</p>
                            <p>{order.numberOfNonVeg} x {menuForDay?.NonVeg || "N/A"}</p>
                            <p
                                className="cursor-pointer underline"
                                onClick={() => toggleExpand(order.id)}
                            >
                                {expanded[order.id] ? "Hide" : "View"} Additional Items
                            </p>
                            <p>{order.totalAmount}</p>
                        </div>

                        <div className="sm:hidden flex flex-col gap-2 p-2 border rounded-md bg-gray-100">
                            <p><strong>Date:</strong> {order.orderDate}</p>                        
                            <p><strong>Office:</strong> {order.officeName}</p>
                            <p><strong>Veg Items:</strong> {order.numberOfVeg} x {menuForDay?.Veg || "N/A"}</p>
                            <p><strong>Non-Veg Items:</strong> {order.numberOfNonVeg} x {menuForDay?.NonVeg || "N/A"}</p>
                            <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                            <button
                                onClick={() => toggleExpand(order.id)}
                                className="underline text-sm"
                            >
                                {expanded[order.id] ? "Hide" : "View"} Additional Items
                            </button>
                        </div>

                        {expanded[order.id] && (
                            <div key={order.id} className="mt-2 p-2 bg-white border rounded-md">
                                <p className="text-sm font-semibold">Additional Booked Items:</p>
                                <p className="text-sm text-gray-700">
                                    {order.additionalBookedItems.concat(", " + order.guestBookedItems)}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RenderOrders;