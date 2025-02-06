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
            <p className="my-6 text-section-heading">Staff details</p>
            <div className="p-2 md:grid border bg-gray-400 rounded-t-md border-black grid-cols-5">
                <p>Name</p>
                <p>Email</p>
                <p>Phone</p>
                <p>Preference</p>
                <p>Actions</p>
            </div>
            {mockOfficeData.staff.map((staff) => (
                <div key={staff._id} className="md:grid gap-4 grid-cols-5 border-b border-r border-l border-black p-2">
                    <p>{staff.name}</p>
                    <p>{staff.email}</p>
                    <p>{staff.phone}</p>
                    <p>{staff.preference}</p>
                    <div className="flex gap-1 ">
                        <p className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-300 px-2 rounded-md">Edit</p>
                        <p className="hover:cursor-pointer bg-red-400 hover:bg-red-300 px-2 rounded-md">Delete</p>
                        <p className="hover:cursor-pointer bg-green-400 hover:bg-green-300 px-2 rounded-md">View</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default Page