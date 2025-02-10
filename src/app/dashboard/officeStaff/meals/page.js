"use client"
import { useState } from "react"
const Page = () => {
    // We'll fetch from an API later
    // This is restuarant data
    const mockData = {
        name: "KFC",

        address: {
            street: "Gulmohar",
            city: "Patna",
            pincode: "800001"
        },
        closed: false,
        max_capacity: 50,

        menu: {
            Monday: [
                { _id: 1, item: "roti", price: 20 },
                { _id: 2, item: "tea", price: 10 }
            ],
            Tuesday: [
                { _id: 3, item: "Pizza", price: 200 }
            ],
            Wednesday: [
                { _id: 5, item: "Veg Meals", price: 100 },
                { _id: 6, item: "Non-Veg Meals", price: 150 }
            ]
        },
        special_menu: [
            { _id: 1, item: "Burger", price: 100 },
            { _id: 2, item: "Fries", price: 50 }
        ]
    }

    const employeeData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        preference: "Non Veg"
    }

    const [splMenu, setSplMenu] = useState(false);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date(Date.now());
    let day = date.getDay();
    const dayOfWeek = weekday[day];

    // Get today's menu 
    const todayMenu = mockData.menu[dayOfWeek] || []; // Avoids errors if no menu exists
    console.log(todayMenu);

    return (
        <div className="mx-2">
            <h2 className="my-6 text-section-heading text-heading font-heading">Choose your meal</h2>

            <h3 className="text-heading text-section-heading my-4" >{mockData.name}</h3>
        
                <p  > Your current preference is <b>{employeeData.preference}</b> </p>
                <div className="flex md:flex-row flex-col gap-2 md:items-center">
                    <p>Change preference: </p>
                    <div className="flex">
                    <select className="my-2 p-2 border-primary border rounded-md">
                        <option value="">Select your preference</option>
                        <option value="special">Special</option>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                    </select>
                    </div>
                </div>
    
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-1 rounded-md">Confirm</button>
            <p className="text-2xl my-4">Want to eat something different? </p>
            <div className="flex">
                <p className=" my-1 hover:cursor-pointer hover:border-b hover:border-black"
                    onClick={() => setSplMenu(!splMenu)}>Special menu {splMenu ? <> &uarr;</> : <>&darr;</>}</p>
                <div>

                </div>

            </div>
            {
                splMenu && <div>
                    {mockData.special_menu.map((item) => (
                        <div key={item._id} className="flex gap-2 my-2 items-center">
                            <p className="w-1/2">{item.item}</p>
                            <p className="w-1/2">Rs.{item.price}</p>
                            <button className="bg-green-400 hover:bg-green-300 px-2 rounded-md">Add</button>
                            <button className="bg-red-400 hover:bg-red-300 px-2 rounded-md">Delete</button>
                        </div>
                    ))}
                    <button className="my-2 bg-button-bg hover:bg-button-hover-bg text-white px-4 py-1 rounded-md">Place Order</button>
                </div>
            }

        </div>
    );
}

export default Page;
