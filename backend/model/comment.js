const mongoose=require("mongoose");
const user=require("./user");
const post=require("./post");
const Schema= mongoose.Schema;
    
const CommentSchema=new Schema({
    user:{
        type:Types.Schema.ObjectId,
        required:true,
        ref:"user"
    },
    post:{
        type:Types.Schema.ObjectId,
        required:true,
        ref:"post"
    },
    text:{
        type:String,
        required:true
    },
    timestamps: true
});

const comment=mongoose.model("comment",CommentSchema);
module.exports=comment;
