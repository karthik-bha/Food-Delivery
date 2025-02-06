"use client"

import { useState } from "react"

const mockData = [
    {
        order_id: 1,
        items: [
            { item_id: 1, name: "roti", price: 20, quantity: 2 },
            { item_id: 2, name: "tea", price: 10, quantity: 2 },
        ],
        total: 100, // Calculated server side
        status: "pending",
    }, {
        order_id: 2,
        items: [
            { item_id: 1, name: "roti", price: 20, quantity: 2 },
            { item_id: 2, name: "tea", price: 10, quantity: 2 },
        ],
        total: 100,
        status: "pending",
    },
    {
        order_id: 3,
        items: [
            { item_id: 1, name: "roti", price: 20, quantity: 2 },
            { item_id: 2, name: "tea", price: 10, quantity: 2 },
        ],
        total: 100,
        status: "completed",
    }
]

const Page = () => {
    const [filter, setFilter]=useState("All");
      // Filter orders based on selected status
      const filteredOrders = filter === "All" ? mockData : mockData.filter(order => order.status === filter);
    return (
        <div>
            <h2 className="text-heading text-section-heading my-6">My Orders</h2>
            <select className="border border-black rounded-md p-2 my-2" 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
            >
                <option value="All">All</option>
                <option value="pending" >Pending</option>
                <option value="completed">Completed</option>
            </select>

            <div className="flex md:flex-row flex-col gap-2">
                {filteredOrders.length === 0 && <p>No orders found</p>}
                {filteredOrders.map((order) => (
                    <div key={order.order_id} className="border border-black rounded-md p-4">
                        <p >Order ID: {order.order_id}</p>
                        <p >Total: {order.total}</p>
                        <p >Status: <span className={`${order.status === "pending" ? "text-red-500" : "text-green-500"}`}> {order.status}</span></p>
                        <p >Items:</p>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.item_id}>
                                    {item.name} - Rs.{item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page