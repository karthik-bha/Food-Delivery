"use server"
import { connectDB } from "@/lib/db/connectDB";
import OfficeAndRestaurantMapping from "@/lib/models/OfficeAndRestaurantMapping";
import RestaurantOffice from "@/lib/models/RestaurantOffice";
import User from "@/lib/models/userSchema";
export const getRestTime = async (officeId) => {
    console.log(officeId);  
    

    try{
        await connectDB();
   
        const mapping = await OfficeAndRestaurantMapping.findOne({ office_id:officeId });

        const {restaurant_id} = mapping;

        const {timeLimit} = await RestaurantOffice.findById(restaurant_id);
        console.log(timeLimit)
        return timeLimit;

    }catch{
        return ""
    }
}