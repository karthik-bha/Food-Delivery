"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

const Admin = () => {
  const [smallAdminsCount, setSmallAdminsCount] = useState(null);
  const [restaurantOwnersCount, setRestaurantOwnersCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        // Fetch small office admins
        const smallAdminsRes = await axios.get("/api/admin/smallOfficeAdmins");
        const smallAdmins = smallAdminsRes.data?.smallOfficeAdmins || [];
        setSmallAdminsCount(smallAdmins.length);

        // Fetch restaurant owners
        const restaurantOwnersRes = await axios.get("/api/admin/restOwners");
        const restaurantOwners = restaurantOwnersRes.data?.restOwners || [];
        setRestaurantOwnersCount(restaurantOwners.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h2 className="my-12 text-section-heading text-center">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Small Admins */}
        <div className="flex flex-col items-center shadow-md ">
          <div className="p-2 bg-primary rounded-t-md text-sub-heading w-full text-center text-black">
            <h2>Small Office Admins</h2>
          </div>
          <p className="text-2xl p-2">
            {loading ? "Loading..." : smallAdminsCount > 0 ? smallAdminsCount : "NA"}
          </p>
        </div>

        {/* Restaurant Owners */}
        <div className="flex flex-col items-center shadow-md">
          <div className="p-2 bg-primary rounded-t-md w-full text-center text-sub-heading text-black">
            <h2>Restaurant Owners</h2>
          </div>
          <p className="text-2xl p-2">
            {loading ? "Loading..." : restaurantOwnersCount > 0 ? restaurantOwnersCount : "NA"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
