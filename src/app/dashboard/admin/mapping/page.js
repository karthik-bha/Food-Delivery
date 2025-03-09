"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [officeData, setOfficeData] = useState([]);
    const [restOfficeData, setRestOfficeData] = useState([]);
    const [selectedMappings, setSelectedMappings] = useState({});
    const [mappingStatus, setMappingStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchOfficeByRestaurant, setSearchOfficeByRestaurant] = useState({});
    const [searchRestaurant, setSearchRestaurant] = useState("");

    useEffect(() => {      
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchSmallOffices(),
                fetchRestaurantOffices(),
                fetchMappings()
            ]);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchSmallOffices = async () => {
        try {
            const response = await axios.get("/api/offices/get/SmallOffice");
            if (response.data.success) {
                setOfficeData(response.data.offices);
            }
        } catch (err) {
            console.error("Error fetching small offices:", err);
        }
    };

    const fetchRestaurantOffices = async () => {
        try {
            const response = await axios.get("/api/offices/get/RestaurantOffice");
            if (response.data.success) {
                setRestOfficeData(response.data.officeDetails);
            }
        } catch (err) {
            console.error("Error fetching restaurant offices:", err);
        }
    };

    const fetchMappings = async () => {
        try {
            const response = await axios.get("/api/mapping/smallOfficeAndRestaurant");
            if (response.data.success) {
                const mappings = response.data.filteredMappings;
                const mappingObj = {};
                const statusObj = {};

                mappings.forEach(mapping => {
                    const restaurantId = mapping.restaurant_id._id;
                    const officeId = mapping.office_id._id;

                    if (!mappingObj[restaurantId]) {
                        mappingObj[restaurantId] = [];
                    }
                    mappingObj[restaurantId].push(officeId);
                    statusObj[`${restaurantId}-${officeId}`] = mapping.isActive;
                });

                setSelectedMappings(mappingObj);
                setMappingStatus(statusObj);
            }
        } catch (err) {
            console.error("Error fetching mappings:", err);
            toast.error("Failed to fetch mappings");
        }
    };

    const handleCheckboxChange = (restaurantId, officeId, isCurrentlyChecked) => {
        const updatedMappings = { ...selectedMappings };

        if (!updatedMappings[restaurantId]) {
            updatedMappings[restaurantId] = [];
        }

        if (isCurrentlyChecked) {
            updatedMappings[restaurantId] = updatedMappings[restaurantId].filter(id => id !== officeId);
        } else {
            updatedMappings[restaurantId].push(officeId);
            mappingStatus[`${restaurantId}-${officeId}`] = true;
        }

        setSelectedMappings(updatedMappings);
    };

    const handleToggleActive = async (restaurantId, officeId) => {
        const newStatus = !mappingStatus[`${restaurantId}-${officeId}`];
        console.log(newStatus);
        try {
            await axios.post("/api/mapping/updateStatus", {
                restaurant_id: restaurantId,
                office_id: officeId,
                isActive: newStatus
            });

            setMappingStatus(prev => ({
                ...prev,
                [`${restaurantId}-${officeId}`]: newStatus
            }));

            toast.success(`Mapping ${newStatus ? "Activated" : "Deactivated"}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleSaveMappings = async (restaurantId) => {
        const officeIds = selectedMappings[restaurantId] || [];
        // console.log(selectedMappings[restaurantId], " ", restaurantId);
        try {
            const response = await axios.post("/api/mapping/update", {
                restaurant_id: restaurantId,
                office_ids: officeIds
            });

            if (response.data.success) {
                toast.success("Mappings updated successfully");
                fetchMappings();
            } else {
                toast.error("Failed to update mappings");
            }
        } catch (error) {
            console.error("Error updating mappings:", error);
            toast.error("Error updating mappings");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="mx-2">
            <h2 className="my-12 text-section-heading">Map Small Offices to Restaurants</h2>

            <input
                type="text"
                placeholder="Search Restaurant Office"
                className="p-2 border rounded mb-4 w-full"
                value={searchRestaurant}
                onChange={(e) => setSearchRestaurant(e.target.value)}
            />

            {restOfficeData
                .filter(rest => rest.name.toLowerCase().includes(searchRestaurant.toLowerCase()))
                .map((rest) => (
                    <div key={rest._id} className="border p-4 mb-4 bg-gray-50">
                        <h3 className="font-bold text-lg mb-2">{rest.name}</h3>

                        <input
                            type="text"
                            placeholder="Search Small Office"
                            className="p-2 border rounded my-2 w-full"
                            value={searchOfficeByRestaurant[rest._id] || ''}
                            onChange={(e) => setSearchOfficeByRestaurant(prev => ({
                                ...prev,
                                [rest._id]: e.target.value
                            }))}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                            {officeData
                                .filter(office =>
                                    office.name.toLowerCase().includes((searchOfficeByRestaurant[rest._id] || '').toLowerCase())
                                )
                                .filter(office => {
                                    const isMappedToAnother = Object.keys(selectedMappings).some(
                                        restId => restId !== rest._id && selectedMappings[restId]?.includes(office._id)
                                    );
                                    return !isMappedToAnother;
                                })
                                .map((office) => {
                                    const isChecked = selectedMappings[rest._id]?.includes(office._id) || false;
                                    const isActive = mappingStatus[`${rest._id}-${office._id}`] ?? true;

                                    return (
                                        <div key={office._id} className="p-3 border rounded bg-white flex items-center justify-between">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                    checked={isChecked}
                                                    onChange={() => handleCheckboxChange(rest._id, office._id, isChecked)}
                                                />
                                                <span>{office.name}</span>
                                            </label>

                                            {isChecked && (
                                                <button
                                                    className={`px-4 py-1 rounded ${isActive ? "bg-green-500" : "bg-red-500"} text-white`}
                                                    onClick={() => handleToggleActive(rest._id, office._id)}
                                                >
                                                    {isActive ? "Active" : "Inactive"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        <button 
                            className="btn-primary mt-4 px-6 py-2 rounded bg-blue-600 text-white"
                            onClick={() => handleSaveMappings(rest._id)}
                        >
                            Save Mappings
                        </button>
                    </div>
                ))
            }
        </div>
    );
};

export default Page;
