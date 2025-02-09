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
{/* <div>           
<div className="flex text-content ">
    <OfficeAdminSide/>
    <div className="w-[100vw]">
    <OfficeAdminNav/> 
    <div className="mx-2">
        {children}
        </div>      
    </div>
</div> 
</div> */}