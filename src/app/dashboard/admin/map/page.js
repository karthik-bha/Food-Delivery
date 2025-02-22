"use client"

import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

const Page = () => {
    const [officeData, setOfficeData] = useState([]);
    const [restOfficeData, setRestOfficeData] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState({});
    const [loading, setLoading] = useState(true);
    // We will get all restaurants and offices of same district and state
    useEffect(() => {
        fetchSmallOffices();
        fetchRestaurantOffices();
    }, [])

    // Fetch small office data
    const fetchSmallOffices = async () => {
        try {
            const response = await axios.get("/api/offices/get/SmallOffice");
            console.log(response.data);
            if (response.data.success) {
                const data = response.data.offices;
                setOfficeData(data); // Correct state update
            } else {
                throw new Error(response.data.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch restaurant office data
    const fetchRestaurantOffices = async () => {
        try {
            const response = await axios.get("/api/offices/get/RestaurantOffice");
            console.log(response.data);
            if (response.data.success) {
                const data = response.data.officeDetails;
                setRestOfficeData(data); // Correct state update
            } else {
                throw new Error(response.data.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };



    // Whenever we select a restaurant, state is updated. example:-
    //  {office1: rest1, office2: rest2, office3: rest3}
    const handleSelectChange = (officeId, restaurantId) => {
        setSelectedRestaurants((prev) => ({
            ...prev,
            [officeId]: restaurantId,
        }));
    };


    // Updates or creates new mapping of small office and restaurant
    async function handleMapping(officeId) {
        const selectedRestaurantId = selectedRestaurants[officeId];
        if (!selectedRestaurantId) {
            toast.error("Please select a restaurant before confirming.");
            return;
        }
        const response = await axios.post("/api/mapping/smallOfficeAndRestaurant", {
            smallOfficeId: officeId,
            restaurantOfficeId: selectedRestaurantId
        });
        console.log(response);
        if (response.data.success) {
            toast.success(response.data.message);

        } else {
            toast.error(response.data.message);
        }

    };

    if (loading) {
        return <Loader />
    }

    return (
        <div className="mx-2">
            <h2 className="my-12 text-section-heading">Map small offices to restaurants</h2>

            <div className="md:grid grid-cols-3 gap-4 text-center font-semibold bg-primary text-secondary p-2 rounded-t-md">
                <p>Small office name</p>
                <p>Restaurant assigned</p>
                <p>Action</p>
            </div>

            {/* This displays all related small offices and related restaurants */}

            {/* First we'll list all smallOffices  */}
            {officeData.map((office) => (
                <div key={office._id} className="md:grid grid-cols-3 p-2 flex flex-col gap-4  border-r border-l  border-black border-b items-center">
                    <p className="text-center p-2 ">{office.name}</p>

                    {/* Then we will embedd all the restaurants of same district and state of small office */}
                    <div className="flex items-center mx-auto">
                        <select className=" border border-black hover:cursor-pointer 
                    rounded-md  p-1 text-center"
                            value={selectedRestaurants[office._id] || ""}
                            onChange={(e) => handleSelectChange(office._id, e.target.value)}
                        >
                            <option
                                value=""
                            >Select</option>
                            {restOfficeData.map((restOffice) => (
                                <option key={restOffice._id} value={restOffice._id}>
                                    {restOffice.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Confirm the mapping  */}
                    <div className="flex items-center mx-auto">
                        <button className="btn-primary"
                            onClick={() => { handleMapping(office._id) }}>Confirm Mapping</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Page