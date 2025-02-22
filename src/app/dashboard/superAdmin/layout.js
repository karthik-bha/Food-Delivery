import Navbar from "@/components/superAdmin/navbar/Navbar";
import Sidebar from "@/components/superAdmin/sidebar/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="text-content bg-home-bg">
            <Navbar />       
            <div className="flex">
            <Sidebar/>
            <div className="mx-auto ">
                {children}
            </div>
            </div>
        </div>
    );
}