"use client"
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";



const Page = () => {

    const [orders, setOrders] = useState(null);
    // const [additionalLength, setAdditionalLength] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [])

    // Fetch orders on load
    async function fetchOrders() {
        try {
            const response = await axios.get("/api/order/get");
            const fetchedData = response.data;
            setOrders(fetchedData.orders);
            console.log(fetchedData.orders);

        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <h2 className="text-section-heading my-12">Office Orders</h2>
            <div className="grid md:grid-cols-5 p-2 bg-primary rounded-t-md text-white">
                <p>Order Id </p>
                <p>Grand Total</p>
                <p>Veg Meals</p>
                <p>Non Veg Meals</p>
                <p>Additional Meals Count</p>
            </div>
            {loading && <Loader />}
            {orders && orders.length === 0 && <p>No orders found</p>}
            <div className="border-r border-l border-black">               
                {orders && orders.length > 0 && <>
                    {
                        orders.map((order) => {
                            return (
                                <div key={order._id} className="border-b border-black grid md:grid-cols-5 gap-4 p-2">
                                    <p className="overflow-x-auto">{order._id}</p>
                                    <p>{order.TotalAmount}</p>
                                    <p>{order.NumberOfVeg}</p>
                                    <p>{order.NumberOfNonVeg}</p>
                                    <p>{order.AdditionalOrder.length}</p>
                                </div>
                            )
                        })
                    }
                </>}

            </div>
        </div>
    )
}


export default Page;

// Filter orders based on selected status
// const filteredOrders = filter === "All" ? mockData : mockData.filter(order => order.status === filter);
// const [filter, setFilter] = useState("All");
// return (
//     <div>
//         <h2 className="text-heading text-section-heading my-6">My Orders</h2>
//         <select
//             className="bg-black  text-white hover:bg-primary-hover
//          hover:cursor-pointer
//         rounded-md border border-white px-2 py-1 my-2"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//         >
//             <option value="All">All</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//         </select>

//         <div className="border-t border-r border-l border-black rounded-md ">
//             <div className="flex flex-col md:grid md:grid-cols-4 font-bold bg-primary text-secondary p-4">
//                 <p>Order ID</p>
//                 <p>Total</p>
//                 <p>Status</p>
//                 <p>Items</p>
//             </div>

//             {filteredOrders.length === 0 && <p className="text-center">No orders found</p>}

//             {filteredOrders.map((order) => (
//                 <div key={order.order_id} className="flex p-4 flex-col md:grid md:grid-cols-4  border-b border-primary py-2">
//                     <p>{order.order_id}</p>
//                     <p>Rs. {order.total}</p>
//                     <p className={`${order.status === "pending" ? "text-red-500" : "text-green-500"}`}>
//                         {order.status}
//                     </p>
//                     <div>
//                         {Object.values(order.items).map((item, index) => (
//                             <p key={index}>{item.name} - Rs. {item.price}</p>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </div>
// );
// };
// const actual = [

// ]

// const mockData = [
//     {
//         order_id: 1,
//         items: {
//             Veg: { name: "Veg Meals", price: 100 },
//             NonVeg: { name: "Non-Veg Meals", price: 150 }
//         },
//         total: 100, // Calculated server-side
//         status: "pending",
//     },
//     {
//         order_id: 2,
//         items: {
//             Veg: { name: "Veg Meals", price: 100 },
//             NonVeg: { name: "Non-Veg Meals", price: 150 }
//         },
//         total: 100,
//         status: "pending",
//     },
//     {
//         order_id: 3,
//         items: {
//             Veg: { name: "Veg Meals", price: 100 },
//             NonVeg: { name: "Non-Veg Meals", price: 150 }
//         },
//         total: 100,
//         status: "completed",
//     }
// ];
