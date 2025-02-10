

const officeAdmin = () => {
  const mockOfficeData = {
    name: "Office1",
    office_open: true,
    state: "Bihar",
    district: "district",
    street_address: "2, patna",
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
    <div className="py-12">    
      <h2 className="text-center  text-section-heading my-6">Overview</h2>
      <div className="flex flex-col gap-4 md:grid  md:grid-cols-2 mx-2 md:w-[50vw] " >

        {/* First Card  */}
        <div className=" shadow-[0px_0px_15px_7px_rgba(0,0,0,0.1)] flex flex-col gap-2  mx-auto  w-full">
         <div className="text-secondary bg-primary rounded-t-lg p-4"> 
          <h2 className="text-section-heading font-sub-heading">Office Details</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
          <p>
            <span className="font-semibold">Name:</span>  {mockOfficeData.name}
          </p>
          <p className="font-semibold">Address</p>
          <div className="mx-2">
            <p>
              <span className="font-semibold"> State: </span> {mockOfficeData.state}
            </p>
            <p>
              <span className="font-semibold" >   District: </span> {mockOfficeData.district}
            </p>
            <p>
              <span className="font-semibold"> Street: </span> {mockOfficeData.street_address}
            </p>

          </div>
          <p>
            <span className="font-semibold">  Status: </span> {mockOfficeData.office_open ? "Open" : "Closed"}
          </p>
          <div className="flex items-center  gap-2">
            <p className="font-semibold">Set status: </p>
            <select className="border border-black 
             hover:cursor-pointer
            rounded-md px-2 py-1 my-2">
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
            <button className="px-4 py-1 rounded-md bg-primary hover:bg-primary-hover text-white">Confirm</button>
          </div>
          
          </div>
        </div>


          {/* Second card  */}
        <div className=" shadow-[0px_0px_15px_7px_rgba(0,0,0,0.1)] flex flex-col gap-2  mx-auto  w-full">
          <div className="text-secondary bg-primary rounded-t-lg p-4"> <h2 className="text-section-heading font-sub-heading">Staff Details</h2></div>
          <div className="p-4 flex flex-col gap-2">
          <p>
            <span className="font-bold">Total staff:</span>  10
          </p>
          <p>
            <span className="font-bold ">Veg Staff:</span> 5
          </p>
          <p>
            <span className="font-bold">Non Veg Staff:</span> 5
          </p>
          <p>
            <span className="font-bold">Today&apos;s Menu </span>
          </p>
          <div className="mx-2">
            <p><span className="text-green-600">Veg:</span> Roti, Tea, Rajma, lassi.</p>
            <p> <span className="text-red-600">Non-Veg:</span> Chicken Biryani, lassi.</p>
          </div>
          <div className="flex">
            <button className="bg-black border hover:bg-primary-hover
              text-white px-4 py-2 rounded-lg">Quick order</button>
          </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default officeAdmin