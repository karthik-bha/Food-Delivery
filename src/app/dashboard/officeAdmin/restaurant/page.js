"use client"
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [restaurantData, setRestaurantData] = useState(null);
    const [regularMenuData, setRegularMenuData] = useState(null);
    const [additionalMenuData, setAdditionalMenuData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Define day of the week
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDay = new Date(Date.now()).getDay();
    const dayOfWeek = weekday[currDay]; // Current day of the week

    useEffect(() => {
        fetchRestaurantData();
        fetchMenuData();
    }, [])

    // Fetches restaurant data on load
    async function fetchRestaurantData() {
        try {
            const response = await axios.get("/api/offices/get/RestaurantOffice");
            if (response.data.success) {
                toast.success(response.data.message);
                setRestaurantData(response.data.officeDetails);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Error fetching restaurant data");
        } finally {
            setLoading(false);
        }
    }

    // Fetch menu data on initial load
    async function fetchMenuData() {
        try {
            const response = await axios.get("/api/menu/get");
            if (response.data.success) {
                setRegularMenuData(response.data.menu.regularItem[dayOfWeek]);
                setAdditionalMenuData(response.data.menu.additionalMenu);
                toast.success("Menu data fetched successfully");
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Error fetching menu data");
        } finally {
            setLoading(false);
        }
    }

    const todayMenu = regularMenuData || {}; // Fallback to empty object if no menu available
    if (loading) {
        return <Loader/>;
    }

    return (
        <div>
            <h2 className="my-6 text-section-heading text-center">Restaurant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-[70vw] md:max-w-[50vw] gap-6 mx-auto">
                {restaurantData ? (
                    <div className="shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                        <div className="text-secondary bg-primary rounded-t-lg p-4">
                            <h3 className="text-[1.6rem]">{restaurantData.name}</h3>
                        </div>

                        <div className="mx-4 my-6">
                            <p><b>Restaurant Name: </b>{restaurantData.name}</p>
                            <p><b>Phone: </b>{restaurantData.phone}</p>
                            <div className="flex gap-1">
                                <p><b>Address:</b></p>
                                <p>{restaurantData.street_address}, {restaurantData.district}, {restaurantData.state}</p>
                            </div>
                            <p><b>Status: </b><span className={`${restaurantData.isActive ?"text-green-500":"text-red-500"} `}>{restaurantData.isActive ? "Active" : "Inactive"}</span></p>
                            <p><b>Close Time: </b>{restaurantData.timeLimit}</p>
                        </div>
                    </div>
                ) : (
                    <>Loading..</>
                )}

                {/* Menu for the day */}
                <div className="shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                    <div className="text-secondary bg-primary rounded-t-lg p-4">
                        <h3 className="text-[1.6rem]">Menu for {dayOfWeek}</h3>
                    </div>
                    <div className="mx-4 my-6">
                        {todayMenu && todayMenu.Veg && todayMenu.NonVeg ? (
                            <div>
                                <p><b>Veg Meals:</b></p>
                                <p>{todayMenu.Veg}</p>
                                <p><b>Non-Veg Meals:</b></p>
                                <p>{todayMenu.NonVeg}</p>
                            </div>
                        ) : (
                            <p>No menu available for today.</p>
                        )}
                    </div>
                </div>

                {/* Additional menu items */}
                <div className=" col-span-1 md:col-span-2 shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                    <div className="text-secondary bg-primary rounded-t-lg p-4">
                        <p className="text-[1.6rem]">Additional Menu Items</p>
                    </div>
                    <div className="mx-4 my-6">
                        <div className="grid grid-cols-2">
                            <p><b>Item</b></p>
                            <p><b>Price</b></p>
                        </div>
                        {additionalMenuData && additionalMenuData.map((menu) => (
                            <div key={menu._id} className="grid grid-cols-2">
                                <p>{menu.name}</p>
                                <p>{menu.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
