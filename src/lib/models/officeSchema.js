import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],

    location:{
        street:{
            type:String,
            require:true
        },
        city:{
            type:String,
            require:true
        },
        pincode:{
            type:String,
            require:true
        }
    },

    //stores staff data associated with an office, added after office creation
    staff: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            status: {
                type: String,
                enum: ["present", "absent"],
                default: "present"
            },
            Meal:{
                type: String,
                enum: ["Veg", "Non-Veg"],
                default: "Veg"
            }
        }
    ],

    //guests are temporary, not stored in users
    guests: [
        {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String },
            status: { type: String, enum: ["present", "absent"], default: "absent" }
        }
    ],


}, { timestamps: true });

const Office = mongoose.models.Office || mongoose.model('Office', officeSchema);
export default Office;