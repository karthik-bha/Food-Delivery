const Page = () => {
    const mockOfficeData = {
        name: "Office1",
        isActive:true,
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
        <div>
            <div className="my-12  shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)]  mx-auto">
                <div className="bg-primary text-secondary rounded-t-md ">
                    <h2 className=" p-4 text-heading text-sub-heading">Office Details</h2>
                </div>
                <div className=" p-4">
                    <p>
                        <span className="font-bold"> Name:</span>  {mockOfficeData.name}
                    </p>
                    <p>
                        <span className="font-bold">   Address:</span> {mockOfficeData.address.street}, {mockOfficeData.address.city}, {mockOfficeData.address.pincode}
                    </p>
                    <p>
                        <span className="font-bold">  Status:</span> {mockOfficeData.isActive ? "Open" : "Closed"}
                    </p>

                </div>

            </div>
            <div className="my-4 flex flex-col">
                <p className="text-sub-heading">Change Office Status </p>
                <select defaultValue={true} className="border rounded-md border-primary px-2 py-1 my-2">
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </select>
                <button className="bg-primary hover:bg-primary-hover text-secondary rounded-md px-2 py-1">Confirm</button>
            </div>
        </div>
    )
}

export default Page