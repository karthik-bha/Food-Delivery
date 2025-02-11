import AdminNav from "@/components/admin/adminNav/AdminNav";
import AdminSideNav from "@/components/admin/adminSideNav/adminSideNav";


export default function Layout({ children }) {
    return (
        <div className="text-content ">

           <AdminNav/>
            <div className="flex">
               <AdminSideNav/>
                <div className="mx-auto">
                    {children} 
                </div>
            </div>
        </div>
    );
}
