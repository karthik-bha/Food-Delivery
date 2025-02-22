"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [officeData, setOfficeData] = useState(null);
    const [staffData, setStaffData] = useState(null);
    const [additionalItems, setAdditionalItems] = useState([]);

    useEffect(() => {
        fetchOfficeData();
    }, []);

    async function fetchOfficeData() {
        try {
            const response = await axios.get("/api/offices/get/SmallOffice");
            console.log(response.data.officeData);
            setOfficeData(response.data.officeData);
            setStaffData(response.data.staffStats);
            setAdditionalItems(response.data.officeData.additional_items);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch office data.");
        }
    }

    async function placeOrder(NumberOfVeg, NumberOfNonVeg, AdditionalOrder, orderStyle) {
        try{
            const response = await axios.post("/api/order/placeOrder", {
                NumberOfVeg,
                NumberOfNonVeg,
                AdditionalOrder,
                orderStyle
            });
            console.log(response.data);
            toast.success("Order placed successfully.");
        }catch(err){
            console.log(err);
            toast.error("Failed to place order.");
        }
    }
    return (
        <div>
            <h2 className="text-section-heading my-12">Place Order</h2>
            <div>              
                {staffData ? (
                    <div >
                        <h3 className="font-bold text-sub-heading text-center my-6">Veg and Non veg meals</h3>
                        <p><strong>Veg Meals:</strong> {staffData.vegCount}</p>
                        <p><strong>Non-Veg Meals:</strong> {staffData.nonVegCount}</p>
                    </div>
                ) : (
                    <p>Loading staff data...</p>
                )}

                {additionalItems.length > 0 ? (
                        <div className="textcenter">
                        <h3 className="font-bold text-sub-heading my-6">Additional Items</h3>
                        <ul>
                            {additionalItems.map((item) => (
                                <li key={item._id} className="my-4">
                                    <p><strong>Item:</strong> {item.item}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No additional items available.</p>
                )}
            </div>
            <button className="btn-primary"
            onClick={()=>placeOrder(staffData.vegCount,staffData.nonVegCount, additionalItems, "regular" )}>Place Order</button>
        </div>
    );
};

export default Page;
