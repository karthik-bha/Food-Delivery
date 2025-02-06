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
        <div className="">
            <h2 className="my-6 text-heading text-section-heading">Office Details</h2>

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
    )
}

export default Page