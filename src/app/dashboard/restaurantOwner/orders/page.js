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
