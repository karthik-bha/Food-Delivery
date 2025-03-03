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
            console.log(isActive, isVeg, excludeMeal);
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
                fetchUserData();
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
        <div className="mx-2 md:mx-auto">


            {/* Status update options  */}
            {/* Change Status */}

            <div className="mt-4 flex gap-2 items-center md:flex-row flex-col">
                <p className="text-[1.2rem] ">I am absent today, no food for me?</p>
                <div className="flex gap-4 items-center ">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="attendance"
                            value="true"
                            checked={isActive}
                            onChange={() => setIsActive(true)}
                        />
                        Present
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="attendance"
                            value="false"
                            checked={!isActive}
                            onChange={() => setIsActive(false)}
                        />
                        Absent
                    </label>
                </div>
                {/* <p className={` ${isActive ? "text-green-500" : "text-red-500"}`}>
                    {isActive ? "Active" : "Inactive"}
                </p> */}
            </div>

            {/* Change Meal Preference */}
            <div className="mt-4 flex gap-2 items-center md:flex-row flex-col">
                <p className="text-[1.2rem] ">Your preference for a regular meal is</p>
                <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="mealPreference"
                            value="true"
                            checked={isVeg}
                            onChange={() => setIsVeg(true)}
                        />
                        Veg
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="mealPreference"
                            value="false"
                            checked={!isVeg}
                            onChange={() => setIsVeg(false)}
                        />
                        Non-Veg
                    </label>
                </div>
                {/* <p className={` ${isVeg ? "text-green-500" : "text-red-500"}`}>
                    {isVeg ? "Veg" : "Non-Veg"}
                </p> */}
            </div>

            {/* Opt out of Regular Meal */}
            <div className="mt-4 flex gap-2 items-center md:flex-row flex-col">
                <p className="text-[1.2rem]">Would you like to cancel the regular meal?</p>
                <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="excludeMeal"
                            value="true"
                            checked={excludeMeal}
                            onChange={() => setExcludeMeal(true)}
                        />
                        Yes
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="excludeMeal"
                            value="false"
                            checked={!excludeMeal}
                            onChange={() => setExcludeMeal(false)}
                        />
                        No
                    </label>
                </div>
                {/* <p className={` ${excludeMeal ? "text-green-500" : "text-red-500"}`}>
                    {excludeMeal ? "Yes" : "No"}
                </p> */}
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