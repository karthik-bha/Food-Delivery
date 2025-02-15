"use client";

import AddMenu from "@/components/restaurantAdmin/addMenu/AddMenu";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Menus = () => {
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openMenuAdd, setOpenMenuAdd] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    // Fetch menu on first load
    async function fetchMenu() {
        try {
            const response = await axios.get("/api/menu/get");
            const fetchedMenuData = response.data.menu;
            console.log(fetchedMenuData);
            if (response.data.success) {
                toast.success(response.data.message);
                setMenuData(fetchedMenuData);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching menu");
        } finally {
            setLoading(false);
        }
    }

    // Delete a menu item
    async function handleDelete(menuId) {
        try {
            setLoading(true);
            const response = await axios.delete(`/api/menu/delete`, { data: { menuId } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchMenu();
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during menu deletion");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="flex h-[60vh] md:w-[20vw] w-screen justify-center items-center "><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div></div>;
    }

    return (
        <div>
            <h2 className="my-12 text-section-heading">Menu details</h2>
            {openMenuAdd ? <>
                <AddMenu setFormOpen={setOpenMenuAdd} setMenuData={setMenuData} />
            </> :

                <>
                    <button className="bg-primary hover:bg-primary-hover text-secondary px-4 py-2 rounded-md"
                    onClick={() => setOpenMenuAdd(true)}>
                        Add/Edit a menu
                    </button>

                    {/* Display Regular Menu */}
                    <h3 className="text-sub-heading my-6">Regular Menus by Day</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:max-w-[60vw] md:mx-auto mx-4 gap-4">
                        {Object.entries(menuData.regularItem).map(([day, items]) => (
                            <div key={day} className="p-4 border rounded-lg shadow-md">
                                <h4 className="font-bold text-lg">{day}</h4>
                                <p><strong>Veg:</strong> {items.Veg}</p>
                                <p><strong>Non-Veg:</strong> {items.NonVeg}</p>
                                <div className="flex gap-1 text-white my-2">
                                    <button className="bg-yellow-500 hover:bg-yellow-400 px-2 rounded-md"
                                     onClick={() => setOpenMenuAdd(true)}>Edit</button>
                                    <button className="bg-red-500 hover:bg-red-400 px-2 rounded-md"
                                        onClick={() => handleDelete(items._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Display Additional Menu */}
                    <h3 className="text-sub-heading my-6">Additional Menu for All Days</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 md:max-w-[60vw] md:mx-auto mx-4 gap-4">
                        {menuData.additionalMenu.map((item) => (
                            <div key={item._id} className="p-4 border rounded-lg shadow-md">
                                <img src={"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt={item.name} className="w-24 h-24 object-cover mx-auto mb-2" />
                                <h4 className="font-bold">{item.name}</h4>
                                {item.price && <p>Price: ₹{item.price}</p>}
                                <div className="flex gap-1 text-white my-2">
                                    <button className="bg-red-500 hover:bg-red-400 px-2 rounded-md"
                                        onClick={() => handleDelete(item._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}


        </div>
    );
};

export default Menus;
