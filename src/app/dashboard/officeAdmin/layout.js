import OfficeAdminNav from "@/components/officeAdmin/officeAdminNav/OfficeAdminNav";
import OfficeAdminSide from "@/components/officeAdmin/officeAdminSide/officeAdminSide";

export default function Layout({ children }) {
    return (
        <div className="text-content ">

           <OfficeAdminNav/>
            <div className="flex">
               <OfficeAdminSide/>
                <div className="mx-auto">
                    {children} 
                </div>
            </div>
        </div>
    );
}
