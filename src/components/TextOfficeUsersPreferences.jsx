"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "react-toastify";
import axios from "axios";

const TextOfficeUsersPreferences = ({ typeOfUser }) => {
    const [isActive, setIsActive] = useState(false);
    const [isVeg, setIsVeg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [excludeMeal, setExcludeMeal] = useState(false);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        fetchUserData();
    }, []);

    // Gets data first time we land on page 
    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/users/pvtAccess");
            if (response.data.success) {
                const user = response.data.userData;
                setIsActive(user.isActive);
                setIsVeg(user.isVeg);
                setExcludeMeal(user.excludeMeal);
                setUserData(user);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    // Updates state of staff
    const handleConfirm = async () => {
        setUpdating(true);
        try {
            let response;
            if (typeOfUser === "office_staff") {
                response = await axios.put(`/api/users/update/${userData._id}`, { isActive, isVeg, excludeMeal });
            } else {
                response = await axios.put(`/api/users/update/${userData._id}`, { isActive, isVeg, excludeMeal, type: "officeUsers" });
            }
            const fetchedData = response.data.updatedUser;
            if (response.data.success) {
                setIsActive(fetchedData.isActive);
                setIsVeg(fetchedData.isVeg);
                setExcludeMeal(fetchedData.excludeMeal);
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


    if (loading || !userData) {
        return (
            <Loader />
        );
    }

    return (
        <div className="m-4">


            {/* Status update options  */}
                {/* Change Status */}
                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
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
                    <div className="flex gap-2 items-center">
                        <p>Selected status:</p>
                        <p className={` ${isActive ? "text-green-500" : "text-red-500"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>

                {/* Change Meal Preference */}
                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
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
                    <div className="flex gap-2 items-center">
                        <p>Selected status:</p>
                        <p className={` ${isVeg ? "text-green-500" : "text-red-500"}`}>
                            {isVeg ? "Veg" : "Non-Veg"}
                        </p>
                    </div>
                </div>

                {/* Opt out of Regular meal if you do not need */}
                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        <p className="text-[1.2rem] mb-2">Do you want to exclude regular meals?</p>
                        <div className="flex">
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
                    <div className="flex gap-2">
                        <p>Selected status:</p>
                        <p className={` ${excludeMeal ? "text-green-500" : "text-red-500"}`}>
                            {excludeMeal ? "Yes" : "No"}
                        </p>
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


}

export default TextOfficeUsersPreferences;