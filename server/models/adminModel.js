const mongoose=require("mongoose");

// define user author schema
const adminSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true 
    },
    firstname:{
        type:String,
        required:true 
    },
    lastname:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true 
    },
    profileImageurl:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true 
    }
},{"strict":"throw"})

// create model for user author schema
const admin = mongoose.model('admin',adminSchema)

// export
module.exports = admin ;