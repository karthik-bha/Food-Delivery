import OfficeStaffAdditionalMenu from "@/components/officeStaff/officeStaffAdditionalMenu/OfficeStaffAdditionalMenu"
import OfficeStaffDash from "@/components/officeStaff/officeStaffDash/OfficeStaffDash"
const OfficeStaff = async () => {
  return (
    <div className="py-12 relative">
    
      <OfficeStaffDash />
      <div className="my-12">
        {/* <h2 className="my-6 mx-2 text-sub-heading">Would you like to add an item from the additional menu?</h2>
        <OfficeStaffAdditionalMenu /> */}
      </div>

    </div>
  )
}

export default OfficeStaff