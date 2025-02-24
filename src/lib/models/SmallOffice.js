import mongoose from "mongoose";

const smallOfficeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    street_address: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Stores additional items in an object structure: { userId: { itemId: { quantity, price } } }
    additional_items: {
        type: Object,
        default: {}
    },
    guest_items:[
        {
            addedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            item:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"AdditionalMenu",
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
            price:{
                type:Number,
                required:true,
            }

        }
    ]


}, { timestamps: true });



const SmallOffice = mongoose.models.SmallOffice || mongoose.model('SmallOffice', smallOfficeSchema);
export default SmallOffice;

// Example of how this would look
// {
//     "_id": "65d7f9b3...",
//     "name": "Small Office 1",
//     "additional_items": {
//       "65d7a1234...": {  // userId
//         "65d7b4567...": { "quantity": 2, "price": 10 },  // itemId
//         "65d7b5678...": { "quantity": 1, "price": 15 }
//       },
//       "65d7a5678...": {
//         "65d7c7890...": { "quantity": 3, "price": 8 }
//       }
//     }
//   }

