"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const Page = () => {
    const [additionalMenu, setAdditionalMenu] = useState(null);
    const [splMenu, setSplMenu] = useState(false);
    const [additionalQuant, setAdditionalQuant] = useState(null);

    useEffect(() => {
        fetchMenu();
        fetchCart();
    }, [])

    // Get menu on initial load
    async function fetchMenu() {
        try {
            const response = await axios.get("/api/menu/get");
            const fetchedMenuData = response.data.menu;
            if (response.data.success) {
                toast.success(response.data.message);
                setAdditionalMenu(fetchedMenuData.additionalMenu);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error while fetching data");
        }
    }

    // Add item to cart and update the item count
    async function addToCart(itemId, price) {

        try {
            const response = await axios.post("/api/cart/add", { itemId, price });
            if (response.data.success) {
                fetchCart();
                toast.success("Added to cart successfully");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error while adding to cart");
        }
    }

    // Remove item from cart and update the item count

    async function removeFromCart(itemId) {

        try {
            const response = await axios.post("/api/cart/remove", { itemId });
            console.log("Response from server:", response);
            if (response.data.success) {
                fetchCart();
                toast.success("Removed from cart successfully");
            }
        } catch (err) {
            console.log("Error removing from cart:", err); // Log any errors
            toast.error("Error while removing from cart");
        }
    }

    async function fetchCart() {
        console.log("hi");
        try {
            const response = await axios.get("/api/cart/get")
            console.log(response);
            const fetchedData = response.data.additionalItems;
            setAdditionalQuant(fetchedData);
            console.log(fetchedData);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        }
    }
    return (
        <div className="mx-2">
            <h2 className="my-6 text-section-heading text-heading font-heading">Choose your meal</h2>
            <p className=" my-4">Add extra items to your meal </p>
            <div className="flex">
                <p className=" text-sub-heading my-1 hover:cursor-pointer hover:border-b hover:border-black"
                    onClick={() => setSplMenu(!splMenu)}>Additional Menu {splMenu ? <> &uarr;</> : <>&darr;</>}</p>
            </div>

            {splMenu && (
                <div className="my-6">
                    <div className="grid grid-cols-5 text text-center bg-primary text-secondary rounded-t-md p-2">
                        <p>Item name</p>
                        <p>Price</p>
                        <p>Add Item</p>
                        <p>Remove Item</p>
                        <p>Quantity in office cart</p>
                    </div>

                    {additionalMenu ? (
                        additionalMenu.map((item) => (
                            <div key={item._id} className="grid grid-cols-5 border-l border-r 
                            border-b border-black text-center items-center py-2">
                                <p><b>{item.name}</b></p>
                                <p>Rs.{item.price}</p>
                                <div className="flex mx-auto">
                                    <button className="bg-green-400 hover:bg-green-300 
                                    px-2 rounded-md"
                                        onClick={() => addToCart(item._id, item.price)}>
                                        Add
                                    </button>
                                </div>
                                <div className="flex mx-auto">
                                    <button className="bg-red-400 hover:bg-red-300 px-2 
                                    rounded-md"
                                        onClick={() => removeFromCart(item._id)}>
                                        Remove
                                    </button>
                                </div>
                                <div>
                                    {additionalQuant ? (
                                        <>
                                            {
                                                additionalQuant.find((quantItem) => quantItem.item === item._id)?.quantity || 0
                                            }
                                        </>
                                    ) : (
                                        <>Loading..</>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <>Loading...</>
                    )}
                </div>
            )}
        </div>
    );
}

export default Page;
