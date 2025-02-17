"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
const Page = () => {
    const [additionalMenu, setAdditionalMenu] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, [])

    async function fetchMenu() {
        try {
            const response = await axios.get("/api/menu/get");
            const fetchedMenuData = response.data.menu;
            console.log(fetchedMenuData.additionalMenu);
            if (response.data.success) {
                toast.success(response.data.message);
                setAdditionalMenu(fetchedMenuData.additionalMenu);
            }

        } catch (err) {
            console.log(err);
            toast.error("Error while fetching data");
        }
    }

    const [splMenu, setSplMenu] = useState(false);
    return (
        <div className="mx-2">
            <h2 className="my-6 text-section-heading text-heading font-heading">Choose your meal</h2>
            <p className=" my-4">Add extra items to your meal </p>
            <div className="flex">
                <p className=" text-sub-heading my-1 hover:cursor-pointer hover:border-b hover:border-black"
                    onClick={() => setSplMenu(!splMenu)}>Additional Menu {splMenu ? <> &uarr;</> : <>&darr;</>}</p>
                <div>

                </div>

            </div>
            {
                splMenu && <>
                    <div className="my-6">
                        <div className="grid grid-cols-5  text text-center bg-primary 
                        text-secondary rounded-t-md p-2">
                            <p>Item name</p>
                            <p>Price</p>
                            <p>Add Item</p>
                            <p>Remove Item</p>
                            <p>Quantity in cart</p>
                        </div>
                        {additionalMenu ? <>{additionalMenu.map((item) => (
                            <div key={item._id} className="grid grid-cols-5 border-l border-r border-b border-black text-center items-center py-2">
                                <p><b>{item.name}</b></p>
                                <p>Rs.{item.price}</p>
                                <div className="flex  mx-auto">
                                    <button className="bg-green-400 hover:bg-green-300 px-2 rounded-md">Add</button>
                                </div>
                                <div className="flex  mx-auto">
                                    <button className="bg-red-400 hover:bg-red-300 px-2 rounded-md">Delete</button>
                                </div>
                                <div>
                                    0
                                </div>
                            </div>
                        ))}
                        </> :

                            <>Loading...</>
                        }

                    </div>
                </>
            }

        </div >
    );
}

export default Page;
