"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OfficeStaffAdditionalMenu = ({ type }) => {
    const [additionalMenu, setAdditionalMenu] = useState([]);
    const [splMenu, setSplMenu] = useState(false);
    const [additionalQuant, setAdditionalQuant] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
        fetchCart();
    }, []);

    // Fetch additional menu items
    async function fetchMenu() {
        try {
            const response = await axios.get("/api/menu/get");
            if (response.data.success) {
                setAdditionalMenu(response.data.menu.additionalMenu);
            }
        } catch (err) {
            console.error("Error while fetching menu:", err);
            toast.error("Error while fetching menu data");
        }
    }

    // Fetch the logged-in user's cart items
    async function fetchCart() {
        try {
            const response = await axios.get("/api/cart/get");
            if (response.data.success) {
                // Ensure the structure is valid before setting state
                setAdditionalQuant(response.data.additionalItems || {});
            }
        } catch (err) {
            console.error("Error while fetching cart:", err);
            toast.error("Error while fetching cart");
        } finally {
            setLoading(false);
        }
    }

    // Add item to cart
    async function addToCart(itemId, price) {
        try {
            const response = await axios.post("/api/cart/add", { itemId, price });
            if (response.data.success) {
                fetchCart(); // Refresh cart after adding
                toast.success("Added to cart successfully");
            }
        } catch (err) {
            console.error("Error while adding to cart:", err);
            toast.error("Error while adding to cart");
        }
    }

    // Remove item from cart
    async function removeFromCart(itemId) {
        try {
            const response = await axios.post("/api/cart/remove", { itemId });
            if (response.data.success) {
                fetchCart(); // Refresh cart after removing
                toast.success("Removed from cart successfully");
            }
        } catch (err) {
            console.error("Error while removing from cart:", err);
            toast.error("Error while removing from cart");
        }
    }

    return (
        <div className="mx-2 md:mx-auto">
            {/* <p className="my-4">Add extra items to your meal, click below to start.</p> */}
            <div className="flex">
                <button className="btn-primary" onClick={() => setSplMenu(!splMenu)}>
                    {splMenu ? "Close Additional Menu" : "Open Additional Menu"}
                </button>
            </div>

            {splMenu && (
                <div className={`${type === "officeAdmin" ? "" : ""} flex flex-col z-50 items-center justify-center `}>
                    <div className="bg-white p-4 rounded-lg w-[90%] max-w-3xl">
                        <div className="flex justify-between items-center my-4">
                            <h2 className="text-sub-heading">Additional Menu</h2>
                            <button className="btn-primary mx-2" onClick={() => setSplMenu(false)}>x</button>
                        </div>

                        <div className="grid w-full md:grid-cols-5 text-center bg-primary text-table-heading font-table-heading rounded-t-md p-2">
                            <p>Item name</p>
                            <p>Price</p>
                            <p>Add Item</p>
                            <p>Remove Item</p>
                            <p>Quantity in your cart</p>
                        </div>
                        <div className="shadow-default-shadow">
                            {loading ? (
                                <p className="text-center py-4">Loading...</p>
                            ) : additionalMenu.length > 0 ? (
                                additionalMenu.map((item) => {
                                    const quantity = additionalQuant[item._id]?.quantity || 0;
                                    return (
                                        <div key={item._id} className="grid md:grid-cols-5 border-l border-r 
                                    border-b text-center items-center py-2 w-full gap-2">
                                            <p><b>{item.name}</b></p>
                                            <p>Rs.{item.price}</p>
                                            <button className="btn-add mx-auto" onClick={() => addToCart(item._id, item.price)}>
                                                Add
                                            </button>
                                            <button className="btn-delete mx-auto" onClick={() => removeFromCart(item._id)}>
                                                Remove
                                            </button>
                                            <p>{quantity}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center py-4">No additional items available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficeStaffAdditionalMenu;
