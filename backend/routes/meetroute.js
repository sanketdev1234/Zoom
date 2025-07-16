const express=require("express");
const router=express.Router();

const getallmeeting=require("../Controller/meetcontroller").getallmeeting;
const create_new_meet=require("../Controller/meetcontroller").create_new_meet;
const getmeetdetail=require("../Controller/meetcontroller").getmeetdetail;
const deletemeet=require("../Controller/meetcontroller").deletemeet;
const userverification=require("../middleware/authmiddleware").userverification;
const iscorrect_owner=require("../middleware/authmiddleware").iscorrect_owner;

router.get("/all",userverification,getallmeeting);
router.post("/new",userverification,create_new_meet);
router.get("/:meetid/detail",userverification,iscorrect_owner,getmeetdetail);
router.delete("/:meetid/delete",userverification,iscorrect_owner,deletemeet);

module.exports=router;