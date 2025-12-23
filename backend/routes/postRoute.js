const router=require("express").Router({meregParams:true});

const multer=require("multer");
const {storage}=require("../config/cloudinary_config");
const upload=multer({storage});

const postcontroller=require("../Controller/postcontroller");
const iscorrect_owner_post=require("../middleware/authmiddleware").iscorrect_owner_post

//get a single post
router.get("/getpost/:postId",postcontroller.get_single_post);

//get the post of single user
router.get("/getallpost/:personId",postcontroller.get_all_post_user); 

//get the all post of our db ie total feed
router.get("/getallpost",postcontroller.getallpost);

//create a new post
router.post("/addnewpost",upload.single("post-image"), postcontroller.createnewpost);

//handle the post likes
router.get("/likepost/:postId/:personId",postcontroller.likepost);

//edit a post
router.put("/edit/:postId",iscorrect_owner_post,upload.single("edited-post-image") , postcontroller.editpost);

//delete a post
router.delete("/delete/:postId",iscorrect_owner_post,postcontroller.deletepost);


module.exports=router;