const mongoose=require("mongoose");
const user=require("../model/user");
const chat=require("../model/chat");
const meeting=require("../model/meeting");
const ExpressError=require("../Utilities/ExpressError");

module.exports.create_new_chat=async(erq,res)=>{
res.send("see all chat");
};
module.exports.all_chat_see=async(req,res)=>{
    res.send("add new chat")
};
