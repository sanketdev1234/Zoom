const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const user=require("./user");

const ConnectionSchema=new Schema({

    sender:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    receiver:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    status:{
        type:String,
        enum:["pending","accepted","NOTKNOWN"],
        default:"NOTKNOWN"
    }
});

const connection=mongoose.model("connection",ConnectionSchema);
module.exports=connection;