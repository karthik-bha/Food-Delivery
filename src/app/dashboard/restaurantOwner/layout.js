import RestOwnerNav from "@/components/restaurantAdmin/restOwnerNav/restOwnerNav";
import RestOwnerSide from "@/components/restaurantAdmin/restOwnerSide/restOwnerSide";

export default function Layout({ children }) {
    return (
        <div className="text-content ">

           <RestOwnerNav/>
            <div className="flex">
               <RestOwnerSide/>
                <div className="mx-auto">
                    {children} 
                </div>
            </div>
        </div>
    );
}
