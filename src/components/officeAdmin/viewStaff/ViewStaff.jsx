const ViewStaff = ({ selectedStaff, setOpenViewForm }) => {
    return (
        <div className="relative shadow-[0px_0px_15px_10px_rgba(0,0,0,0.1)] mt-24 p-4 bg-white rounded-lg">
            <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
                onClick={() => setOpenViewForm(false)}
            >
                ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">View Staff</h2>

            <div className="space-y-2">
                <p><b>Name:</b> {selectedStaff?.name || "N/A"}</p>
                <p><b>Email:</b> {selectedStaff?.email || "N/A"}</p>
                <p><b>Phone:</b> {selectedStaff?.phone || "N/A"}</p>
                <p>
                    <b>Preference:</b>{" "}
                    <span className={selectedStaff?.isVeg ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {selectedStaff?.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                </p>
                <p>
                    <b>Attendance:</b>{" "}
                    <span className={selectedStaff?.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {selectedStaff?.isActive ? "Active" : "Inactive"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ViewStaff;
