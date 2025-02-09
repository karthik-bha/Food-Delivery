import mongoose from "mongoose";

const smallOfficeSchema=new mongoose.Schema({
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

const SmallOffice = mongoose.models.SmallOffice ||  mongoose.model('SmallOffice', smallOfficeSchema);
export default SmallOffice;