"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditOfficeForm from "@/components/officeAdmin/editOfficeForm/EditOfficeForm";
import Loader from "@/components/Loader";
import GuestAdditionalMenu from "@/components/GuestAdditionalMenu";
import OfficeStaffAdditionalMenu from "@/components/officeStaff/officeStaffAdditionalMenu/OfficeStaffAdditionalMenu";
import Order from "@/components/officeAdmin/order/Order";

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
  const [menuData, setMenuData] = useState(null);
  const [day, setDay] = useState(null);

  // Office Admin states
  const [isActive, setIsActive] = useState(false);
  const [isVeg, setIsVeg] = useState(false);
  const [excludeMeal, setExcludeMeal] = useState(false);

  // For editing office details 
  const [officeForm, setOfficeForm] = useState(false);

  // Order form related
  const [order, setOrder] = useState(false);

  // Load office data on first load
  useEffect(() => {
    fetchOfficeData();
    fetchMenuData();
    fetchOfficeAdmin(); // Optimization possible: populate office_admins office_id;
  }, []);

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
        setIsActive(user.isActive);
        setIsVeg(user.isVeg);
        setExcludeMeal(user.excludeMeal);
        setUserData(user);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Updates state of office_admin
  const handleConfirm = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(`/api/users/update`, { isActive, isVeg, excludeMeal });

      if (response.data.success) {
        setIsActive(response.data.updatedOfficeStaff.isActive);
        setIsVeg(response.data.updatedOfficeStaff.isVeg);
        setExcludeMeal(response.data.updatedOfficeStaff.excludeMeal);
        toast.success(response.data.message + ", Please refresh");
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


  if (loading || !menuData || !staffData || !officeData) {
    return <Loader />;
  }

  return (

    <div className="py-12 relative mx-2">
      {officeForm ?
        <>
          <EditOfficeForm setOfficeForm={setOfficeForm} officeData={officeData} setOfficeData={setOfficeData} />
        </>
        :
        <>
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
            <li>Your total number of meals for today is <b>{staffData.totalMeals}.</b> </li>
            <li><b>{staffData.vegMeals} {menuData.Veg}</b>,
              <b> {staffData.nonVegMeals} {menuData.NonVeg} </b>,
              <b> {staffData.totalAdditionalItems} additional items </b> and <b>{staffData.totalGuestItems} guest items</b> will be delivered today.</li>

            <li>The total cost of Additional Items is <b> {staffData.totalAdditionalItemsPrice}</b>.</li>
            <li>The total cost of Guest Orders is <b>{staffData.totalGuestItemsPrice}</b>.</li>
          </ul>

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
          ):
          <div className="my-4">
            <p>You have opted <b>out</b> of meals for today. No order will be placed. You can opt in again by updating your preferences.</p>
            </div>
          }




          {/* -------------------------------------------------------------- */}

          {/* Add additional items for Guests  */}
          <div className="my-6">
            <h3 className="text-sub-heading">Any guests coming to your office?</h3>
            <div >
              <GuestAdditionalMenu />
            </div>
          </div>

          {/* -------------------------------------------------------------- */}

          {/* Update office preferences  */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold">   Recieve meals from restaurant? (for office) </p>
              <select
                className="border border-black rounded-md px-2 py-1 my-2"
                value={officeStatus.toString()}
                onChange={(e) => setOfficeStatus(e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <button
                className="px-4 py-1 rounded-md bg-primary hover:bg-primary-hover text-white"
                onClick={handleStatusUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Confirm"}
              </button>
            </div>
            <p className={`${officeStatus ? "text-green-400" : "text-red-500"}`}><span className="text-black font-semibold">Selected status:</span> {officeStatus ? "Yes" : "No"}</p>
          </div>
          <div>

            {/* -------------------------------------------------------------- */}
            {/* Update office admin preferences  */}

            <h3 className="my-6 text-sub-heading">Your preferences</h3>
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

            {/* -------------------------------------------------------------- */}

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

          {/* -------------------------------------------------------------- */}
          {/* Additional menu for office admin  */}
          <div className="my-6">
            <h3 className="text-sub-heading"> Would you like to have Additional Menu items?</h3>
            <OfficeStaffAdditionalMenu type={"officeAdmin"} />
          </div>

        </>
      }

    </div>
  );
};

export default OfficeAdmin;

