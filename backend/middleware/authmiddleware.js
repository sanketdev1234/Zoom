require("dotenv").config({path:require("path").resolve(__dirname,"../.env")});
const user=require("../model/user");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const meeting=require("../model/meeting");

module.exports.userverification=async(req,res,next)=>{
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send( "Please register or login first.");
    }
    
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const existing_user=await user.findById(decoded.id);
    if(!existing_user){
        return res.status(404).send( "User not found" );
    }
    else {
        req.user=existing_user;
        next();
    }
    }
    catch(err){
    res.send(err);
    }
}

module.exports.iscorrect_owner=async(req,res,next)=>{
    const id=req.params.meetid;
    const existingowner_id=req.user._id;
    try{
    const meet=await meeting.findById(id).populate("Hosted_by");
    const meet_owner_id=meet.Hosted_by._id;
    if(existingowner_id==meet_owner_id){
        console.log("existing user is owner");
        next();
    }
    else {
        res.status(401).send("unauthorized");
    }
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
    
}