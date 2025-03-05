
import RestOwnerNav from "@/components/restaurantAdmin/restOwnerNav/RestOwnerNav";
import RestOwnerSide from "@/components/restaurantAdmin/restOwnerSide/RestOwnerSide";


export default function Layout({ children }) {
    return (
        <div className="text-content ">

           <RestOwnerNav/>
            <div className="flex">
               <RestOwnerSide/>
                <div className="ml-2 md:mx-auto">
                    {children} 
                </div>
            </div>
        </div>
    );
}
