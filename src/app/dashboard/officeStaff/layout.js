import OfficeStaffNav from "@/components/officeStaff/officeStaffNav/OfficeStaffNav";
import OfficeStaffSide from "@/components/officeStaff/officeStaffSide/OfficeStaffSide";
export default function Layout({ children }) {
    return (
        <div className="text-content bg-home-bg">

           <OfficeStaffNav/>
            <div className="flex gap-2">
               <OfficeStaffSide/>
                <div className="ml-4">
                    {children}
                </div>
            </div>
        </div>
    );
}