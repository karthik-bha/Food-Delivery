import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    regularItem: {
        // Ensures key-value pairs like, {Monday:{Veg:desc, NonVeg:desc}}
        type: Map,
        of: new mongoose.Schema({ 
            Veg: { type: String, required: true },
            NonVeg: { type: String, required: true }
        })
    },
    // Reference to AdditionalMenu items (stores ids of items)
    additionalMenu: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdditionalMenu" }],
    
    // Track which user created the menu
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    // Track which user last updated the menu
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
export default Menu;
