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
        special_menu:[
            { _id: 1, item: "Burger", price: 100 },
            { _id: 2, item: "Fries", price: 50 }
        ]
    }

    // This is office data
    const mockOfficeData = {
        name: "Office1",
        office_open:true,
        address: {
            street: "gilaro",
            city: "Patna",
            pincode: "800001"
        },
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
            <h2 className="my-6 text-section-heading text-heading font-heading">Restaurant</h2>

            <h3 className="text-heading text-section-heading">{mockData.name}</h3>
            <div className="mx-4 my-6">
                <div className="flex gap-2  ">
                    <p><b>Address:</b></p>
                    <p>{mockData.address.street}, {mockData.address.city}, {mockData.address.pincode}</p>
                </div>
                <p><b>Open</b>: {mockData.closed ? "No" : "Yes"}</p>
            </div>

            <h3 className="text-heading text-section-heading">Menu for {dayOfWeek}</h3>
            <div className="mx-4 my-6">
                {todayMenu.length > 0 ? (
                    todayMenu.map((item) => (
                        <div key={item._id} className="flex gap-2 my-2">
                            <p><b>Item:</b> {item.item}</p>
                            <p><b>Price:</b> ₹{item.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No menu available for today.</p>
                )}
            </div>

            <div>
                <p className="text-[1.6rem]">Regular Order</p>
                <div className="mx-4">
                <p>Total Staff: {totalStaff}</p>
                <p>Veg Staff: {totalVegStaff}</p>
                <p>Non-Veg Staff: {totalNonVegStaff}</p>
                <div className="my-2">
                <button className="font-button-text bg-button-bg hover:bg-button-hover-bg text-white px-4 py-2 rounded-md">Order Regular</button>
                </div>
                </div>
            </div>

        </div>
    );
}

export default Page;
