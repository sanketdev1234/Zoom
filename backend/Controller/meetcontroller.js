const ExpressError=require("../Utilities/ExpressError");
const meeting=require("../model/meeting");
const user=require("../model/user")
const chat=require("../model/chat");
const mongoose=require("mongoose");

module.exports.getallmeeting=async(req,res)=>{
    res.send("get all meetting")
};
module.exports.create_new_meet=async(req,res)=>{
    res.send("add new meet");
};
module.exports.getmeetdetail=async(req,res)=>{
    res.send("get detail of meet");
};
module.exports.deletemeet=async(req,res)=>{
    res.send("delete it")
};
