const express=require("express");
const router=express.Router({mergeParams:true});

const userverification=require("../middleware/authmiddleware").userverification;
const iscorrect_owner=require("../middleware/authmiddleware").iscorrect_owner;
const create_new_chat=require("../Controller/chatcontroller").create_new_chat;
const all_chat_see=require("../Controller/chatcontroller").all_chat_see;

router.get("/all",userverification,iscorrect_owner,all_chat_see);
router.post("/new",userverification,create_new_chat);

module.exports=router;
