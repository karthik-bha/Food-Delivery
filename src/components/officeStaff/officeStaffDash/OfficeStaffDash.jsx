"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OfficeStaffDash = () => {
    const [userData, setUserData] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [isVeg, setIsVeg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [menu, setMenuData]=useState(null);

    const restaurantData = {
        menus: {
            Monday: {
                Veg: "2x Roti, Paneer Butter Masala",
                NonVeg: "2x Roti, Chicken Curry",
            },
        },
    };

    
    useEffect(() => {
        fetchUserData();
    }, []);
    
    // Gets data first time we land on page 
    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/users/pvtAccess");
            if (response.data.success) {
                const user = response.data.userData;
                setUserData(user);
                setIsActive(user.isActive);
                setIsVeg(user.isVeg);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setUpdating(true);
        try {
            const response = await axios.put(`/api/users/update/officeStaff`, { isActive, isVeg });

            if (response.data.success) {
                setIsActive(response.data.updatedOfficeStaff.isActive);
                setIsVeg(response.data.updatedOfficeStaff.isVeg);
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


    if (loading) {
        return (
            <div className="flex w-screen justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="m-4">
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

                {/* Menu Card */}
                <div className="col-span-2 shadow-md rounded-md">
                    <div className="p-2 bg-primary text-secondary rounded-t-md">
                        <h2 className="text-center text-sub-heading">
                            Today's menu for {isVeg ? "Veg" : "Non-Veg"} meals
                        </h2>
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <p>{isVeg ? restaurantData.menus.Monday.Veg : restaurantData.menus.Monday.NonVeg}</p>
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
            </div>

            {/* Change Status */}
            <div className="mt-4">
                <p className="text-sub-heading mb-2">Change Your Attendance Status</p>
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
                <p className="text-sub-heading mb-2">Change Your Meal Preference</p>
                <select
                    value={isVeg.toString()}
                    onChange={(e) => setIsVeg(e.target.value === "true")}
                    className="px-2 py-1 border border-black rounded-md"
                >
                    <option value="true">Veg</option>
                    <option value="false">Non-Veg</option>
                </select>
            </div>

            {/* Confirm Button */}
            <div className="mt-4">
                <button
                    onClick={handleConfirm}
                    className="bg-primary hover:bg-primary-hover text-secondary px-4 py-2 rounded-lg flex items-center justify-center"
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
