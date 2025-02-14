import mongoose from "mongoose";

const additionalMenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
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

const AdditionalMenu = mongoose.models.AdditionalMenu || mongoose.model("AdditionalMenu", additionalMenuSchema);
export default AdditionalMenu;
