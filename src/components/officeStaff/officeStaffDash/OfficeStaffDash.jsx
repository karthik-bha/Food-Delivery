"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import OfficeUsersPreferences from "@/components/OfficeUsersPreferences";
import TextOfficeUsersPreferences from "@/components/TextOfficeUsersPreferences";
import OfficeStaffAdditionalMenu from "../officeStaffAdditionalMenu/OfficeStaffAdditionalMenu";

const OfficeStaffDash = () => {    
    const [isVeg, setIsVeg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState(null);    
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
                setIsVeg(user.isVeg);                
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


    // Get menu data on first load
    async function fetchMenu() {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let currDate = new Date().getDay();
        let currDay = daysOfWeek[currDate];
        setCurrDayState(daysOfWeek[currDate]);
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
             <p>   Hi {userData? userData.name : "Loading..."}, today is <b>{menuData && currDayState ? menuData.Theme+" - "+currDayState : "Loading..."}</b> so <b>{menuData ? (isVeg ? menuData.Veg : menuData.NonVeg) : "No Menu for Today."} </b>is coming for you.</p>
            </div>
            <p className="text-sub-heading my-6">Would you like to add an additional menu? </p>
            <OfficeStaffAdditionalMenu />
            {/* Card style  */}
            {/* <OfficeUsersPreferences type={"office_staff"}/> */}

            {/* Document style  */}
            <TextOfficeUsersPreferences type={"office_staff"}/>
          
        </div>
    );
};

export default OfficeStaffDash;

