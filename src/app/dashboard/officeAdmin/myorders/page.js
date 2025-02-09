"use client"

import { useState } from "react"

const mockData = [
    {
        order_id: 1,
        items: {
            Veg: { name: "Veg Meals", price: 100 },
            NonVeg: { name: "Non-Veg Meals", price: 150 }
        },
        total: 100, // Calculated server-side
        status: "pending",
    },
    {
        order_id: 2,
        items: {
            Veg: { name: "Veg Meals", price: 100 },
            NonVeg: { name: "Non-Veg Meals", price: 150 }
        },
        total: 100,
        status: "pending",
    },
    {
        order_id: 3,
        items: {
            Veg: { name: "Veg Meals", price: 100 },
            NonVeg: { name: "Non-Veg Meals", price: 150 }
        },
        total: 100,
        status: "completed",
    }
];

const Page = () => {
    const [filter, setFilter] = useState("All");

    // Filter orders based on selected status
    const filteredOrders = filter === "All" ? mockData : mockData.filter(order => order.status === filter);

    return (
        <div>
            <h2 className="text-heading text-section-heading my-6">My Orders</h2>
            <select
                className="border border-black rounded-md p-2 my-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="All">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>

            <div className="border-t border-r border-l border-black rounded-md ">
                <div className="flex flex-col md:grid md:grid-cols-4 font-bold bg-primary text-secondary p-4">
                    <p>Order ID</p>
                    <p>Total</p>
                    <p>Status</p>
                    <p>Items</p>
                </div>

                {filteredOrders.length === 0 && <p className="text-center">No orders found</p>}

                {filteredOrders.map((order) => (
                    <div key={order.order_id} className="flex p-4 flex-col md:grid md:grid-cols-4  border-b border-primary py-2">
                        <p>{order.order_id}</p>
                        <p>Rs. {order.total}</p>
                        <p className={`${order.status === "pending" ? "text-red-500" : "text-green-500"}`}>
                            {order.status}
                        </p>
                        <div>
                            {Object.values(order.items).map((item, index) => (
                                <p key={index}>{item.name} - Rs. {item.price}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
