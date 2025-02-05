import Navbar from "@/components/superAdmin/navbar/Navbar";

export default function Layout({ children }) {
    return (
        <div className="text-content ">
            <Navbar/>
            <hr className="h-[1px] w-full border-none bg-black"/>            
            <div className="min-h-[70vh] flex justify-center items-center">{children}</div>
        </div>
    );
}