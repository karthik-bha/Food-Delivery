import mongoose from "mongoose";

const smallOfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,

    },
    street_address: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required:true
        default: null,
    },
    // Tracks the additional items added
    additional_items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdditionalMenu",  // AdditionalMenu collection
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },      
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // User who added the item
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // User who last updated the item
            default: null
        }
    }]


}, { timestamps: true });

const SmallOffice = mongoose.models.SmallOffice || mongoose.model('SmallOffice', smallOfficeSchema);
export default SmallOffice;