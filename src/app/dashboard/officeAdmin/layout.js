import OfficeAdminNav from "@/components/officeAdmin/officeAdminNav/OfficeAdminNav";
import OfficeAdminSide from "@/components/officeAdmin/officeAdminSide/officeAdminSide";

export default function Layout({ children }) {
    return (
        <div className="text-content bg-home-bg">

            <OfficeAdminNav/>
            <div className="flex gap-2">
                <OfficeAdminSide/>
                <div className="text-center  w-full ">
                    {children}
                </div>
            </div>
        </div>
    );
}