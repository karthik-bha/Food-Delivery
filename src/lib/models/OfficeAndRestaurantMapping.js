import mongoose from "mongoose";

const officeAndRestaurantMappingSchema = new mongoose.Schema({
    office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SmallOffice",
        required: true
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RestaurantOffice",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const OfficeAndRestaurantMapping = mongoose.models.OfficeAndRestaurantMapping || mongoose.model("OfficeAndRestaurantMapping", officeAndRestaurantMappingSchema);
export default OfficeAndRestaurantMapping;