import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            required: true,
            enum: ["super_admin", "admin", "office_admin", "office_staff"],
        },
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "office_models", // Dynamic reference to the corresponding office model
            default: null,
        },
        office_type: {
            type: Number,
            enum: [1, 2, 3], // 1 = AdminOffice, 2 = RestaurantOffice, 3 = SmallOffice
            required: function () {
                return this.office_id !== null; // Only required when office_id is set
            },
        },
        isVeg:{
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the user who created this document
            // required: true,
            default: null,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the last user who updated this document
            default: null,
        },
    },
    { timestamps: true } 
);

// Defining a Virtual Field for office_models
userSchema.virtual("office_models").get(function () {
    const mapping = {
        1: "AdminOffice",
        2: "RestaurantOffice",
        3: "SmallOffice",
    };
    return mapping[this.office_type] || null;
});

// Enabling Virtuals in JSON and Object Responses
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         required: true,
//         enum: ["super_admin", "admin", "office_admin", "office_staff"]
//     },
//     // This is for office staff and office admin (can be updated after office creation)
//     office_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Office",
//         default:null,
//     },
//     // Store city so we can filter out restuarants based on a certain location
//     location_city: {
//         type:String,
//         required: function () {    //It is required only if role is admin
//             return this.role === "admin" 
//         }
//     },

// }, { timestamps: true });

// const User = mongoose.models.User ||  mongoose.model('User', userSchema);
// export default User;
