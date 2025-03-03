"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditOfficeForm from "@/components/officeAdmin/editOfficeForm/EditOfficeForm";
import Loader from "@/components/Loader";
import GuestAdditionalMenu from "@/components/GuestAdditionalMenu";
import OfficeStaffAdditionalMenu from "@/components/officeStaff/officeStaffAdditionalMenu/OfficeStaffAdditionalMenu";
import Order from "@/components/officeAdmin/order/Order";
import { getRestTime } from "@/actions/officeAdmin/getRestTime";
import OfficeUsersPreferences from "@/components/OfficeUsersPreferences";
import TextOfficeUsersPreferences from "@/components/TextOfficeUsersPreferences";

const OfficeAdmin = () => {
  // Office data and staff calculations 
  const [officeData, setOfficeData] = useState(null);
  const [staffData, setStaffData] = useState(null);

  // Loading and updating state
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // States related to office updation
  const [officeStatus, setOfficeStatus] = useState(null);

  // Menu related states
  const [menuData, setMenuData] = useState({});
  const [day, setDay] = useState(null);

  // Office Admin states 
  const [userData, setUserData] = useState({});

  // Order form related
  const [order, setOrder] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);


  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await fetchOfficeData();
      await fetchMenuData();
      await fetchOfficeAdmin();
    };

    fetchData();
  }, []);


  // This useEffect fetches restaurant closing time
  useEffect(() => {
    if (!userData?.office_id) return;

    const fetchRestaurantTime = async () => {
      const getRestaurantTime = await getRestTime(userData.office_id);
      console.log("REST TIME  " + getRestaurantTime);

      // const targetTime = getTargetTime("16:40"); // Fixed time
      const targetTime = getTargetTime(getRestaurantTime);
      const updateTimer = () => setTimeLeft(calculateTimeLeft(targetTime));

      updateTimer(); // Initial call
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    };

    fetchRestaurantTime();
  }, [userData]);


  // Fetch Office data on initial load
  const fetchOfficeData = async () => {
    try {
      const response = await axios.get("/api/offices/get/SmallOffice");
      console.log(response);
      if (response.data.success) {
        setOfficeData(response.data.officeData);
        setStaffData(response.data.staffStats);
        setOfficeStatus(response.data.officeData.isActive);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch office data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle updates to office status
  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put("/api/offices/update/pvt/SmallOffice", {
        isActive: officeStatus,
      });
      if (response.data.success) {
        toast.success("Office status updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update office status.");
    } finally {
      setUpdating(false);
    }
  };

  // Fetch menu data on initial load and store based on today's day
  const fetchMenuData = async () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currDate = new Date().getDay();
    let currDay = daysOfWeek[currDate];
    setDay(currDay);
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
  };

  // Fetch office_admin
  const fetchOfficeAdmin = async () => {
    try {
      const response = await axios.get("/api/users/pvtAccess");
      const user = response.data.userData;
      if (response.data.success) {
        console.log(response.data.userData);
        // console.log(user.data);
        setUserData(user);
      }
    } catch (err) {
      console.log(err);
    }
  }


  // Converts "HH:MM" string into a Date object for today
  const getTargetTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(hours, minutes, 0, 0); // Set to fixed HH:MM:00.000
    return targetTime;
  };

  // Function to update the countdown timer
  const calculateTimeLeft = (targetTime) => {
    const currentTime = new Date();
    const difference = targetTime - currentTime;
    // console.log(difference);

    if (difference > 0) {
      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      if (minutes > 20) {
        return `${targetTime.getHours()}:${targetTime.getMinutes()}.`;
      }
      return `${minutes}m ${seconds}s`;
    }
    else {
      // console.log(targetTime.split());
      return `${targetTime.getHours()}:${targetTime.getMinutes()} tomorrow`;
    }
  };


  if (loading || !staffData || !officeData) {
    return <Loader />;
  }

  return (

    <div className="py-12 relative mx-2">

      {/* -------------------------------------------------------------- */}
      {/* Initial text  */}
      <h2 className="text-center md:text-left text-section-heading my-6">Welcome to {officeData.name}</h2>
      <div className="flex flex-col gap-2">
        <p>Your office has a total of <b>{staffData.vegCount}</b> Veg Staff and<b> {staffData.nonVegCount} </b>Non-Veg Staff including you.</p>
        <p>Today is <b>{menuData && day ? (menuData.Theme + " - " + day) : "No Menu for Today."}</b></p>
      </div>     

      {/* -------------------------------------------------------------- */}
      {/* Shows order details  */}
      <h3 className="text-sub-heading my-4"> Order overview </h3>
      <ul className="flex flex-col gap-2">
        <li>Your total number of staff is <b>{staffData.totalMeals}.</b> </li>
        <li><b>{staffData.vegMeals} {menuData?.Veg}</b>,
          <b> {staffData.nonVegMeals} {menuData?.NonVeg} </b>,
          <b> {staffData.totalAdditionalItems} additional items </b>  will be delivered today.</li>
        {/* and <b>{staffData.totalGuestItems} guest items</b> */}
        <li>Additional Menu worth Rupees <b> {staffData.totalAdditionalItemsPrice}</b>.</li>
        {/* <li>The total cost of Guest Orders is <b>{staffData.totalGuestItemsPrice}</b>.</li> */}
      </ul>

      {/* Countdown Timer */}
      <div className="text-red-500 font-bold my-2">
        {timeLeft && <p>Please make any changes required before {timeLeft}</p>}
      </div>

      {/* Allow orders only if office is active/opted for orders  */}
      {/* Manual order  */}
      {officeStatus ? (
        <>
          <button className="btn-primary my-2"
            onClick={() => { setOrder(true) }}>Order now</button>
          {order &&
            (
              // Order form
              <div>
                <Order

                  staffData={staffData}
                  officeData={officeData}
                  setOrder={setOrder}
                />
              </div>
            )
          }
        </>
      ) :
        <div className="my-4">
          <p>You have opted <b>out</b> of meals for today. No order will be placed. You can opt in again by updating your preferences.</p>
        </div>
      }


      {/* -------------------------------------------------------------- */}

      {/* Add additional items for Guests  */}
      <div className="my-6">
        <h3 className="text-sub-heading my-4">Any guests coming to your office?</h3>
        <div >
          <GuestAdditionalMenu />

        </div>
        <p className="my-4">Guest Menu worth Rupees <b>{staffData.totalGuestItemsPrice}</b>.</p>
      </div>

      {/* -------------------------------------------------------------- */}

      {/* Update office preferences  */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <p className="font-semibold">Request Restaurant for No food day </p>
          <select
            className="border border-black rounded-md px-2 py-1 my-2"
            value={officeStatus.toString()}
            onChange={(e) => setOfficeStatus(e.target.value === "true")}
          >
            {/* Clicking this makes office active - you will recieve food */}
            <option value="true">No</option>
            {/* Clicking this makes office inActive - you will NOT recieve food */}
            <option value="false">Yes</option>
          </select>
          <button
            className="px-4 py-1 rounded-md bg-black hover:bg-primary-hover text-white"
            onClick={handleStatusUpdate}
            disabled={updating}
          >
            {updating ? "Updating..." : "Confirm"}
          </button>
        </div>        
      </div>


      {/* -------------------------------------------------------------- */}
      {/* Update office admin preferences  */}

      {/* Card Style  */}
      {/* <OfficeUsersPreferences typeOfUser={"office_admin"} /> */}

      {/* Document style  */}
      <TextOfficeUsersPreferences typeOfUser={"office_admin"} />



      {/* -------------------------------------------------------------- */}
      {/* Additional menu for office admin  */}
      <div className="my-6">
        <h3 className="text-sub-heading my-4">Are you craving for any additional food item? </h3>
        <OfficeStaffAdditionalMenu type={"officeAdmin"} />
      </div>

    </div>
  );
};

export default OfficeAdmin;

