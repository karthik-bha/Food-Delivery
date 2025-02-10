const OfficeStaff = () => {
  const restuarnatData={
    menus:{
      Monday:{
        Veg:"2x Roti, Paneer butter masala",
        NonVeg:"2x Roti, Chicken curry"
      }
    }
  }
  const mockData={
    isActive:true,
  }
  return (
    <div className="py-12 ">
      <h2 className="text-center  text-section-heading my-6">Overview</h2>

      {/* First Card  */}
      <div className="mx-2 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-2 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)]">
        <div className="p-2 bg-primary text-secondary rounded-t-md">
          <h4 className="text-center text-sub-heading ">Current Status</h4>
          </div>
          <div className="flex justify-center">
            <p className={`text-sub-heading ${mockData.isActive? 'text-green-500':'text-red-500'}`}>Active</p>
          </div>
         
        </div>

        {/* Second Card  */}
        <div className="col-span-2 shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)]">
          <div className="p-2 bg-primary text-secondary  rounded-t-md">
          <h2 className="text-center text-sub-heading ">Today's menu for {mockData.isVeg?  "Veg" : "Non-Veg"} meals</h2>
          </div>
          <div className="flex justify-center items-center my-2">
            <p >{mockData.isVeg? restuarnatData.menus.Monday.Veg : restuarnatData.menus.Monday.NonVeg }</p>
          </div>
        </div>
      

      {/* Third Card  */}
      <div className="col-span-2">
        <div className="shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)]">
          <div className="p-2 bg-primary text-secondary  rounded-t-md">
          <h2 className="text-center text-sub-heading ">Your meal preference</h2>
          </div>
          <div className="flex justify-center items-center my-2">
            <p className={`text-sub-heading ${mockData.isVeg? 'text-green-500':'text-red-500'}`} >{mockData.isVeg? "Veg" : "Non Veg" }</p>
          </div>
        </div>
      </div>
      
    </div>
    <div className="m-2">
          <p className="text-sub-heading my-2">Change your attendance status </p>
          <select defaultValue={true} className="px-2 py-1 hover:cursor-pointer border border-black rounded-md ">
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
        <div className="flex mx-2">
        <button className="bg-primary hover:bg-primary-hover  text-secondary px-4 py-1 rounded-lg">Confirm</button>
        </div>
    </div>
    

  )
}

export default OfficeStaff