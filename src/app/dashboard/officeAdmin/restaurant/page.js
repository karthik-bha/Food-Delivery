const Page = () => {


    // We'll fetch from an API later
    // This is restuarant data
    const mockData = {
        name: "KFC",

        state:"Bihar",
        district:"patna",
        street_address: "2, street5",
        closed: false,
        max_capacity: 50,

        menu: {
            Monday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
                         
            Tuesday:{
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
            Wednesday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
            Thursday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
            Friday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
            Saturday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
            Sunday: {
                Veg:{name:"Veg meals",description:"2 Roti, Paneer butter masala"},
                NonVeg:{name:"NonVeg meals",description:"2 Roti, Chicken curry"}
            },
        },
        special_menu: [
            { _id: 1, item: "Burger", price: 100, tag:"Veg" },
            { _id: 2, item: "Fries", price: 50, tag:"Non-Veg" }
        ]
    }

    // This is office data
    const mockOfficeData = {
        name: "Office1",
        office_open: true,
        state:"Bihar",
        district:"patna",
        street_address: "2, patna",
        staff: [
            {
                _id: 1, name: "John", email: "IY5oM@example.com",
                phone: "1234567890", role: "office_staff",
                preference: "veg",
            },
            {
                _id: 2, name: "John", email: "IY5oM@example.com",
                phone: "1234567890", role: "office_staff",
                preference: "veg",
            },
            {
                _id: 3, name: "John", email: "IY5oM@example.com",
                phone: "1234567890", role: "office_staff",
                preference: "non-veg",
            },
            {
                _id: 4, name: "John", email: "IY5oM@example.com",
                phone: "1234567890", role: "office_staff",
                preference: "non-veg",

            },
        ],
        guests: [
            {
                _id: 1, name: "John2"
            }
        ]

    }
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date(Date.now());
    let day = date.getDay();
    const dayOfWeek = weekday[day];

    // Get today's menu 
    const todayMenu = mockData.menu[dayOfWeek] || []; // Avoids errors if no menu exists
    console.log(todayMenu);
    const totalStaff = mockOfficeData.staff.length;
    const totalVegStaff = mockOfficeData.staff.filter((staff) => staff.preference === "veg").length;
    const totalNonVegStaff = mockOfficeData.staff.filter((staff) => staff.preference === "non-veg").length;
    return (
        <div>
            <h2 className="my-6 text-section-heading text-center">Restaurant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-[70vw] md:max-w-[50vw] gap-6 mx-auto">
                {/* first card  */}
                <div className="shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                <div className="text-secondary bg-primary rounded-t-lg p-4"> 
                    <h3 className="text-[1.6rem] ">{mockData.name}</h3>
                    </div>
                    <div className="mx-4 my-6">
                        <div className="flex gap-2  ">
                            <p><b>Address:</b></p>
                            <p>{mockData.street_address}, {mockData.district}, {mockData.state}</p>
                        </div>
                        <p><b>Open</b>: {mockData.closed ? "No" : "Yes"}</p>
                    </div>
                </div>
                {/* Second card  */}
                <div className=" shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                <div className="text-secondary bg-primary rounded-t-lg p-4">   <h3 className="text-[1.6rem]">Menu for {dayOfWeek}</h3>
                </div>
                    <div className="mx-4 my-6">
                    {todayMenu && todayMenu.Veg && todayMenu.NonVeg ? (
                            <div>
                                <p><b>Veg Meals:</b></p>                                
                                <p>{todayMenu.Veg.description}</p>
                                <p><b>Non-Veg Meals:</b></p>                                
                                <p>{todayMenu.NonVeg.description}</p>
                            </div>
                        ) : (
                            <p>No menu available for today.</p>
                        )}
                    </div>
                    <div>
                    </div>
                </div>
                
                {/* Third card  */}
                <div className="shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                <div className="text-secondary bg-primary rounded-t-lg p-4"> 
                    <p className="text-[1.6rem]">Regular Order</p>
                    </div>
                    <div className="mx-4 my-6">
                        <p>Total Staff: {totalStaff}</p>
                        <p>Veg Staff: {totalVegStaff}</p>
                        <p>Non-Veg Staff: {totalNonVegStaff}</p>
                        <div className="my-2 flex gap-2">
                            <button className="font-button-text 
                        bg-primary hover:bg-primary-hover text-white px-4 py-1 rounded-md">Order regular</button>
                            <button className="font-button-text bg-primary 
                        hover:bg-primary-hover text-white px-4 py-1 rounded-md">Edit regular order</button>

                        </div>
                    </div>
                </div>

                {/* Fourth Card  */}
                <div className=" shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)]">
                <div className="text-secondary bg-primary rounded-t-lg p-4"> 
                    <p className="text-[1.6rem] ">Special Menu</p>
                    </div>
                    <div className="mx-4 my-6">
                    <div className="grid grid-cols-3">
                        <p><b>Item</b></p>
                        <p><b>Price</b></p>
                        <p><b>Tag</b></p>
                        </div>
                        {mockData.special_menu.map((menu) => (
                            <div key={menu._id} className="grid grid-cols-3">
                                <p>{menu.item}</p>
                                <p>{menu.price}</p>
                                <p>{menu.tag}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Page;
