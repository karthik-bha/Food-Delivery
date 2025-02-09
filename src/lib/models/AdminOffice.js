import mongoose from "mongoose";

const adminOfficeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    state:{
        type:String, 
        required:true,
    },
    district:{
        type:String,
        required:true,

    },
    street_address:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true
        default:null,
    }

},{timestamps:true});

const AdminOffice = mongoose.models.AdminOffice ||  mongoose.model('AdminOffice', adminOfficeSchema);
export default AdminOffice;