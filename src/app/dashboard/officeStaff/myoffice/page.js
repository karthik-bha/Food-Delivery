const Page = () => {
    const mockOfficeData = {
        name: "Office1",
        office_open: true,
        address: {
            street: "gilaro",
            city: "Patna",
            pincode: "800001"
        },
        staff: [
            {
                _id: 1, name: "John", email: "john@example.com",
                phone: "1234567890",
                preference: "veg",
            },
            {
                _id: 2, name: "John", email: "john@example.com",
                phone: "1234567890",
                preference: "veg",
            },
            {
                _id: 3, name: "John", email: "john@example.com",
                phone: "1234567890",
                preference: "non-veg",
            },
            {
                _id: 4, name: "John", email: "john@example.com",
                phone: "1234567890",
                preference: "non-veg",

            },
        ]

    }
    return (
        <div className="md:max-w-[20vw] shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)]  mx-auto">
            <div className="bg-primary text-secondary rounded-t-md ">
                <h2 className="my-6 p-2 text-heading text-section-heading">Office Details</h2>
            </div>
            <div className="mx-4">
                <p>
                    <span className="font-bold"> Name:</span>  {mockOfficeData.name}
                </p>
                <p>
                    <span className="font-bold">   Address:</span> {mockOfficeData.address.street}, {mockOfficeData.address.city}, {mockOfficeData.address.pincode}
                </p>
                <p>
                    <span className="font-bold">  Status:</span> {mockOfficeData.office_open ? "Open" : "Closed"}
                </p>
                <select className="border border-black px-2 py-1 my-2">
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                </select>
            </div>
        </div>
    )
}

export default Page