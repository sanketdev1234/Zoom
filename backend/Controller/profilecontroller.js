const profile=require("../model/profile");
const user = require("../model/user");
const validators=require("../Utilities/JoiValidators");

module.exports.getProfile=async(req,res)=>{
const userid=req.params.userId;
console.log("user:",userid);
try{
const user_profile=await profile.findOne({owner:userid}).populate("owner");
console.log(user_profile);
res.send(`the selected user profile is ${user_profile}`);
}
catch(err){
    console.log("error:",err);
    return res.send(err);
}
}


module.exports.createProfile=async(req,res)=>{
    
    
    const current_user_id=req.user._id;
   const { error, value }=validators.profile_validator.validate(req.body);
    if(error){
        console.log("schema validation of profile fail");
        return res.send(error);
    }
    else {
            console.log('Validated Data:', value);
        }


        const bio= value.bio;
        const headline=value.headline;
        const location=value.location
        const social=value.social
        const Education=value.Education;
        const Experience=value.Experience;

    console.log("bio",bio);
    console.log("location",location);
    console.log("headline",headline);
    console.log(social);
    console.log(Education);
    console.log(Experience);


    try{
    const created_profile_new=await profile.insertOne({bio:bio , headline:headline,location:location , social:social,Education:Education , Experience:Experience});
    created_profile_new.owner=current_user_id;
    await created_profile_new.save();
    res.send(`new profile added : ${created_profile_new}`);
    }
    catch(err){
        console.log("err:",err);
        return res.send(err);
    }

};


module.exports.updateProfile=async(req,res)=>{
    const profileid=req.params.profileId;
    const {error,value}=validators.profile_validator_update.validate(req.body);
   
    if(error){
        console.log("schema validation of profile update fail");
        return res.send(error);
    }
    else{
    console.log('Validated Data:', value);
    if(Object.keys(value).length===0){
        return res.send("no fields to update!");
    }
    }
       try{
        const updated_profile=await profile.findOneAndUpdate({_id:profileid,owner:req.user._id},{$set:value},{new:true});
        console.log("updated profile is :",updated_profile);
        if(req.file){
            let updated_profile_picture={
                url:req.file.path,
                file_id:req.file.filename
            }
            const user_profile_update=await user.findByIdAndUpdate(req.user._id,{profile_picture:updated_profile_picture},{new:true});
            console.log(user_profile_update);
        }
        res.send(` profile gets updated! : ${ updated_profile}`);
       }

       catch(err){
        console.log("err:",err);
        return res.send(err);
       }
};



module.exports.deleteProfile=async (req,res)=>{
    const profileid=req.params.profileId;
    try{
        const profile_delete=await profile.findOneAndDelete({_id:profileid,owner:req.user._id});
        console.log("deleted profile is :",profile_delete);
        // This method finds the document, deletes it, and returns the deleted document, which is perfect for confirmation.

        res.send(`profile deleted successfully: ${profile_delete}`);
        
        const current_user_id=req.user._id;
        const current_user=await user.findOne({ _id: req.user._id });
        console.log(current_user);
        const current_profile_picture=current_user.profile_picture;
        console.log("current profile pic:",current_profile_picture);
        if(current_profile_picture){
            // delete the data from cloudinary.
            const deleted_result=await cloudinary.uploader.destroy(current_profile_picture.file_id);
            console.log("deleted result from cloudinary is :",deleted_result);
        }
        else{
            current_user.profile_picture.url=process.env.DEFAULT_PHOTO_URL;
            current_user.profile_picture.file_id="default_name";
            await current_user.save();
        }
        
    }
    catch(error){
        console.log("err:",error);
        return res.send(error);
    }
};