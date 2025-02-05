const Page = () => {
  return (
    <div className="my-6 mx-4">
      <h1 className="mt-12 text-section-heading">Admin Manager</h1>
      <div className="flex my-6 ">
      <button className="px-4 py-1 bg-green-500 hover:bg-green-400 text-white rounded-md">Add a new admin</button>
      </div>
      {/* for medium large screen  */}
      <div className="hidden md:grid text-white grid-cols-5 border border-black bg-gray-400 rounded-t-md">
        <p>Name</p>
        <p>Location Assigned</p>
        <p>Offices Assigned </p>
        <p>Restaurants Assigned</p>
        <p>Actions</p>
      </div>
      
      <div className="hidden md:grid grid-cols-5 border-r border-l border-b border-black">
        <p>john doe</p>
        <p>patna</p>
        <p>4</p>
        <p>2</p>
        <div className="flex gap-2 items-center mx-auto ">
            <p>Edit</p>
            <p>Delete</p>
            <p>View</p>
        </div>
        
      </div>
      {/* for mobile  */}
      <div className="md:hidden p-4 border-black rounded-md shadow-md">
            <div className="flex justify-between">
            <p className="font-bold">Name: </p>
            <p>john doe</p>
            </div>
            <div className="flex justify-between">
            <p className="font-bold">Location Assigned: </p>
            <p>patna</p>
            </div>
            <div className="flex justify-between">
            <p className="font-bold">Offices Assigned: </p>
            <p>4</p>
            </div>
            <div className="flex justify-between">
            <p className="font-bold">Restaurants Assigned: </p> 
            <p>2</p>
            </div>    
      </div>
    </div>
  )
}

export default Page