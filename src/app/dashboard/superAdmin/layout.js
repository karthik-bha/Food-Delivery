import Navbar from "@/components/superAdmin/navbar/Navbar";
import Sidebar from "@/components/superAdmin/sidebar/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="text-content bg-home-bg">
            <Navbar />
       
            <div className="flex gap-2">
            <Sidebar/>
            <div className="text-center  w-full ">
                {children}
            </div>
            </div>
        </div>
    );
}