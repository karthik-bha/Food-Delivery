import RestClientOverviewDash from "@/components/restaurantAdmin/restClientOverviewDash/RestClientOverviewDash";
import RestDetailsDash from "@/components/restaurantAdmin/restDetailsDash/RestDetailsDash";

const OfficeAdmin = () => {
  return (
    /** 
     number of small offices,     
     overview of restaurant details (name, email, phone, address, closeTime, active?)
     edit restaurant details
     list of current orders(active)
     **/
    <div className="py-12">

      <h2 className="text-center  text-section-heading my-6">Overview</h2>

      {/* Restaurant details  */}
      <div className="grid-cols-1 md:grid-cols-2 grid gap-6 ">

        <RestDetailsDash />
        <RestClientOverviewDash/>
      </div>



    </div>
  );
};

export default OfficeAdmin;
