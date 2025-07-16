const router=require("express").Router();

const signup=require("../Controller/authcontroller").signup;
const login=require("../Controller/authcontroller").login;
const userstatus=require("../Controller/authcontroller").userstatus;
const logout=require("../Controller/authcontroller").logout;

router.post("/signup",signup);
router.post("/login",login);
router.get("/authstatus",userstatus);
router.get("/logout",logout);

module.exports=router;