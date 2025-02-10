import OfficeStaffNav from "@/components/officeStaff/officeStaffNav/OfficeStaffNav";
import OfficeStaffSide from "@/components/officeStaff/officeStaffSide/OfficeStaffSide";
export default function Layout({ children }) {
    return (
        <div className="text-content bg-home-bg">

           <OfficeStaffNav/>
            <div className="flex ">
               <OfficeStaffSide/>
               <div className="mx-auto">
                    {children} 
                </div>
            </div>
        </div>
    );
}