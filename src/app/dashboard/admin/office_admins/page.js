"use client";
import AddOfficeForm from "@/components/AddOfficeForm";
import OfficeAdminReg from "@/components/admin/adminForms/OfficeAdminReg";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [officeAdmins, setSmallOfficeAdmins] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addOfficeForm, setAddOfficeForm] = useState(false);
    const [linkedUser, setLinkedUser] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        fetchSmallOfficeAdmins();
    }, []);

    async function fetchSmallOfficeAdmins() {
        try {
            const response = await axios.get("/api/admin/smallOfficeAdmins");
            setSmallOfficeAdmins(response.data.smallOfficeAdmins || []);
        } catch (err) {
            console.log(err);
            toast.error("Error during fetch");
        } finally {
            setLoading(false);
        }
    }

    if (loading ) {
        return <Loader />;
    }

    async function handleDelete(officeAdmin) {
        try {
           
            const office = officeAdmin.office_id;
            let response;
            // temp fix
            setLoading(true);
            if(!office){
                const offficeAdminId = officeAdmin._id;
                response = await axios.delete(`/api/users/delete/officeAdmin/${offficeAdminId}`);
            }else{
                const id = officeAdmin.office_id._id;
                response = await axios.delete(`/api/offices/delete/${id}`);
            }

            if (response.data.success) {
                setSmallOfficeAdmins((prev) => prev.filter(admin => admin._id !== officeAdmin._id));
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Error during deletion");
        }finally{
            setLoading(false);
        }
    }

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormOpen(true);
    };

    const handleNewRegistration = () => {
        setSelectedAdmin(null);
        setFormOpen(true);
    };

    return (
        <div className="mx-4 my-8">
            {formOpen ? (
                <OfficeAdminReg
                    setFormOpen={setFormOpen}
                    officeAdmins={officeAdmins}
                    setSmallOfficeAdmins={setSmallOfficeAdmins}
                    selectedAdmin={selectedAdmin}
                />
            ) : addOfficeForm ? (
                <AddOfficeForm
                    linkedUserId={linkedUser._id}
                    linkedUserName={linkedUser.name}
                    setAddOfficeForm={setAddOfficeForm}
                    officeType={"SmallOffice"}
                />
            ) : (
                <>
                    <h2 className="text-section-heading my-12 text-center">
                        Small Office Admins
                    </h2>

                    <div className="flex my-4">
                        <button className="btn-primary" onClick={handleNewRegistration}>
                            Add a New Office Admin
                        </button>
                    </div>

                    <div>
                        <div className="md:grid grid-cols-5 bg-primary text-secondary text-center p-2 font-semibold border-b">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Office Name</p>
                            <p>Office Address</p>
                            <p>Actions</p>
                        </div>

                        {/* Data Rows */}
                        <div className="shadow-default-shadow">
                            {officeAdmins.map((admin) => (
                                <div key={admin._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l p-2">
                                    <p>{admin.name}</p>
                                    <p>{admin.email}</p>
                                    <p>{admin.office_id ? admin.office_id.name : "No office registered."}</p>
                                    <p>
                                        {admin.office_id
                                            ? `${admin.office_id.street_address}, ${admin.office_id.district}, ${admin.office_id.state}`
                                            : "No office registered."}
                                    </p>
                                    <div className="flex gap-2 mx-auto justify-center items-center">
                                        {!admin.office_id && (
                                            <button
                                                className="btn-add"
                                                onClick={() => {
                                                    setAddOfficeForm(true);
                                                    setLinkedUser(admin);
                                                }}
                                            >
                                                Add office
                                            </button>
                                        )}

                                        <button className="btn-edit" onClick={() => handleEdit(admin)}>
                                            Edit
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm(
                                                    "Are you sure you want to delete? All office users and mappings will be deleted."
                                                )) {
                                                    handleDelete(admin);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;


// "use client"
// import AddOfficeForm from "@/components/AddOfficeForm";
// import OfficeAdminReg from "@/components/admin/adminForms/OfficeAdminReg";
// import Loader from "@/components/Loader";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const Page = () => {

//     const [formOpen, setFormOpen] = useState(false);
//     const [officeAdmins, setSmallOfficeAdmins] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [addOfficeForm, setAddOfficeForm] = useState(false);
//     const [linkedUser, setLinkedUser] = useState(null);
//     const [selectedAdmin, setSelectedAdmin] = useState(null);

//     useEffect(() => {
//         fetchSmallOfficeAdmins();
//     }, [])

//     async function fetchSmallOfficeAdmins() {
//         try {
//             const response = await axios.get("/api/admin/smallOfficeAdmins");
//             console.log(response.data.smallOfficeAdmins);
//             setSmallOfficeAdmins(response.data.smallOfficeAdmins || []);
//         } catch (err) {
//             console.log(err);
//             toast.error("Error during fetch");
//         } finally {
//             setLoading(false);
//         }
//     }
//     if (loading || !officeAdmins) {
//         return <Loader />
//     }

//     async function handleDelete(officeAdmin) {
//         try {
//             // console.log(officeAdmin.office_id._id)
//             const id = officeAdmin.office_id._id;
//             console.log(id);
//             const response = await axios.delete(`/api/offices/delete/${id}`);
//             // console.log(response.data.deletedUser);
//             if (response.data.success) {
//                 // const deletedUser = response.data.deletedUser;
//                 setSmallOfficeAdmins((prev) => prev.filter(admin => admin._id !== officeAdmin._id));
//                 toast.success(response.data.message);
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Error during deletion");
//         }
//     }

//     const handleEdit = (admin) => {
//         setSelectedAdmin(admin);
//         setFormOpen(true);
//     };


//     return (
//         <div className="mx-4 my-8">
//             {formOpen ?
//                 <OfficeAdminReg setFormOpen={setFormOpen} officeAdmins={officeAdmins} setSmallOfficeAdmins={setSmallOfficeAdmins} /> :
//                 addOfficeForm ?
//                     <AddOfficeForm linkedUserId={linkedUser._id} linkedUserName={linkedUser.name} setAddOfficeForm={setAddOfficeForm} officeType={"SmallOffice"} />
//                     :
//                     <>
//                         <h2 className="text-section-heading my-12 text-center">
//                             Small Office Admins
//                         </h2>

//                         <div className="flex my-4 ">
//                             <button className="btn-primary                        "
//                                 onClick={() => setFormOpen(true)}>
//                                 Add a New Office Admin
//                             </button>
//                         </div>

//                         <div>

//                             <div className="md:grid grid-cols-5 bg-primary text-secondary text-center p-2 font-semibold border-b    ">
//                                 <p>Name</p>
//                                 <p>Email</p>
//                                 <p>Office Name</p>
//                                 <p>Office Address</p>
//                                 <p>Actions</p>
//                             </div>

//                             {/* Data Rows */}
//                             <div className="shadow-default-shadow">
//                                 {officeAdmins.map((admin) => {
//                                     return (
//                                         <div key={admin._id} className="text-center md:grid gap-4 grid-cols-5 border-b border-r border-l  p-2">
//                                             <p>{admin.name}</p>
//                                             <p>{admin.email}</p>

//                                             <p>{admin.office_id ? admin.office_id.name : "No office resgistered."}</p>
//                                             <p>{admin.office_id ? admin.office_id.street_address + ", " + admin.office_id.district + ", " +
//                                                 admin.office_id.state : " No office registered."} </p>
//                                             <div className="flex gap-2 mx-auto justify-center items-center">

//                                                 {!admin.office_id &&
//                                                     <button className="btn-add"
//                                                         onClick={() => {
//                                                             setAddOfficeForm(true)
//                                                             setLinkedUser(admin)
//                                                         }}>
//                                                         Add office
//                                                     </button>
//                                                 }

//                                                 <button className="btn-edit" 
//                                                 onClick={() => handleEdit(admin)}>
//                                                     Edit
//                                                 </button>;
                                                
//                                                 <button className="btn-delete"
//                                                     onClick={() => {
//                                                         if (window.confirm
//                                                             ("Are you sure you want to delete? All office users and mappings will be deleted."
//                                                             )) {
//                                                             handleDelete(admin);
//                                                         }
//                                                     }}>
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )
//                                 })}

//                             </div>
//                         </div>
//                     </>
//             }

//         </div>
//     );
// };

// export default Page;
