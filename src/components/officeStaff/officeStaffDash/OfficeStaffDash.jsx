"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const OfficeStaffDash = () => {
    // const [userData, setUserData] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [isVeg, setIsVeg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [menuData, setMenuData] = useState(null);
    const [excludeMeal, setExcludeMeal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [currDayState, setCurrDayState] = useState(null);

    useEffect(() => {
        fetchUserData();
        fetchMenu();
    }, []);

    // Gets data first time we land on page 
    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/users/pvtAccess");
            if (response.data.success) {
                const user = response.data.userData;
                // setUserData(user);
                setIsActive(user.isActive);
                setIsVeg(user.isVeg);
                setExcludeMeal(user.excludeMeal);
                setUserData(user);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    // Updates state of staff
    const handleConfirm = async () => {
        setUpdating(true);
        try {
            const response = await axios.put(`/api/users/update`, { isActive, isVeg, excludeMeal });

            if (response.data.success) {
                setIsActive(response.data.updatedOfficeStaff.isActive);
                setIsVeg(response.data.updatedOfficeStaff.isVeg);
                setExcludeMeal(response.data.updatedOfficeStaff.excludeMeal);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error("API Error:", err.response ? err.response.data : err.message);
            toast.error(err.response?.data?.message || "Update failed. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    // Get menu data on first load
    async function fetchMenu() {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let currDate = new Date().getDay();
        let currDay = daysOfWeek[1];
        setCurrDayState(daysOfWeek[1]);
        console.log(currDay);
        try {
            const response = await axios.get("/api/menu/get");
            const fetchedMenuData = response.data.menu;
            console.log(fetchedMenuData.regularItem[currDay]);
            if (response.data.success) {

                toast.success(response.data.message);
                setMenuData(fetchedMenuData.regularItem[currDay]);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching menu");
        }
    }
    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="m-4">

            <div className="text-1xl md:text-2xl my-12">
                Hi {userData.name}, today is {menuData && currDayState ? menuData.Theme+" - "+currDayState : "Loading..."}. Your regular meal is {menuData ? (isVeg ? menuData.Veg : menuData.NonVeg) : "No Menu for Today."}.
            </div>

            {/* Status & Menu Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Status Card */}
                <div className="col-span-2 shadow-md rounded-md">
                    <div className="p-2 bg-primary text-secondary rounded-t-md">
                        <h4 className="text-center text-sub-heading">Current Status</h4>
                    </div>
                    <div className="flex justify-center p-4">
                        <p className={`text-sub-heading ${isActive ? "text-green-500" : "text-red-500"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>

                {/* Meal Preference Card */}
                <div className="col-span-2 shadow-md rounded-md">
                    <div className="p-2 bg-primary text-secondary rounded-t-md">
                        <h2 className="text-center text-sub-heading">Your Meal Preference</h2>
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <p className={`text-sub-heading ${isVeg ? "text-green-500" : "text-red-500"}`}>
                            {isVeg ? "Veg" : "Non-Veg"}
                        </p>
                    </div>
                </div>

                {/* Shows if user has opted out of Regular meals */}
                <div className="col-span-2 shadow-md rounded-md">
                    <div className="p-2 bg-primary text-secondary rounded-t-md">
                        <h2 className="text-center text-sub-heading">Opt out of Regular Meals?</h2>
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <p className={`text-sub-heading ${excludeMeal ? "text-green-500" : "text-red-500"}`}>
                            {excludeMeal ? "Yes" : "No"}
                        </p>
                    </div>
                </div>

            </div>

            {/* Status update options  */}

            <div className="grid md:grid-cols-2">
                {/* Change Status */}
                <div className="mt-4">
                    <p className="text-[1.2rem] mb-2">Change Your Attendance Status</p>
                    <select
                        value={isActive.toString()}
                        onChange={(e) => setIsActive(e.target.value === "true")}
                        className="px-2 py-1 border border-black rounded-md"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                {/* Change Meal Preference */}
                <div className="mt-4">
                    <p className="text-[1.2rem] mb-2">Change Your Meal Preference</p>
                    <select
                        value={isVeg.toString()}
                        onChange={(e) => setIsVeg(e.target.value === "true")}
                        className="px-2 py-1 border border-black rounded-md"
                    >
                        <option value="true">Veg</option>
                        <option value="false">Non-Veg</option>
                    </select>
                </div>

                {/* Opt out of Regular meal if you do not need */}
                <div className="mt-4">
                    <p className="text-[1.2rem] mb-2">Do you want to exclude regular meals?</p>
                    <select
                        value={excludeMeal.toString()}
                        onChange={(e) => setExcludeMeal(e.target.value === "true")}
                        className="px-2 py-1 border border-black rounded-md"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

            </div>

            {/* Confirm Button */}
            <div className="mt-4">
                <button
                    onClick={handleConfirm}
                    className="btn-primary"
                    disabled={updating}
                >
                    {updating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    ) : (
                        "Confirm"
                    )}
                </button>
            </div>
        </div>
    );
};

export default OfficeStaffDash;

{/* Menu Card */ }
{/* <div className="col-span-2 shadow-md rounded-md">
                    <div className="p-2 bg-primary text-secondary rounded-t-md">
                        <h2 className="text-center text-sub-heading">
                            Today's menu for {isVeg ? "Veg" : "Non-Veg"} meals
                        </h2>
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <p>{menuData ? (isVeg ? menuData.Veg : menuData.NonVeg) : "No Menu for Today."}</p>
                    </div>
                </div> */}
