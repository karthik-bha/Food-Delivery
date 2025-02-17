"use client"
import axios from "axios";
import { useEffect, useState } from "react";

const mockData = {
    lifeTimeOrders: 5,   // fetch from orders
    pendingOrders: 3,
    fulfilledOrders: 2,
}



const RestClientOverviewDash = () => {
    const [totalOffices, setTotalOffices] = useState(0);

    useEffect(() => {
        getOfficeStats();
    }, [])

    async function getOfficeStats() {
        try {
            const response = await axios.get("/api/mapping/get");
            setTotalOffices(response.data.mappings.length);
        }
        catch (err) {
            console.log(err);
        }

    }
    return (
        <div className="mx-4">

            <div className="bg-primary text-secondary rounded-t-md px-4 py-2">
                <h2 className="text-sub-heading">Client details</h2>
            </div>
            <div className="p-4">
                <p><b>Total Offices: </b><span>{totalOffices ? totalOffices : "Loading.."}</span></p>
            </div>


            <div className="bg-primary text-secondary px-4 py-2">
                <h2 className="text-sub-heading">Number of orders</h2>
            </div>
            <div className="p-4">
                <p><b>Pending orders: </b><span>{mockData.pendingOrders}</span></p>
                <p><b>Fulfilled orders: </b><span>{mockData.fulfilledOrders}</span></p>
                <p><b>Lifetime orders: </b><span>{mockData.lifeTimeOrders}</span></p>
            </div>

        </div>
    )
}

export default RestClientOverviewDash