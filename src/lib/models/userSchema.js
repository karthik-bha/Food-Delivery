import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["super_admin", "admin", "office_admin", "office_staff"]
    },
    // This is for office staff and office admin (can be updated after office creation)
    office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        default:null,
    },
    // Store city so we can filter out restuarants based on a certain location
    location_city: {
        type:String,
        required: function () {    //It is required only if role is admin
            return this.role === "admin" 
        }
    },

}, { timestamps: true });

const User = mongoose.models.User ||  mongoose.model('User', userSchema);
export default User;