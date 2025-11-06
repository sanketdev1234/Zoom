const router=require("express").Router({mergerParams:true});

const profileController=require("../Controller/profilecontroller");
const iscorrect_owner_profile=require("..//middleware/authmiddleware").iscorrect_owner_profile

router.get("/get/:userId",profileController.getProfile);
router.post("/addnew",profileController.createProfile);
router.put("/edit/:profileId",iscorrect_owner_profile,profileController.updateProfile);
router.delete("/delete/:profileId",iscorrect_owner_profile,profileController.deleteProfile);
module.exports=router;

// in add, edit , delete routes, userId will be of current present logged in user only because only then he will be able to add, edit or delete his profile.
// while in get route, userId can be of any user whose profile we want to see.