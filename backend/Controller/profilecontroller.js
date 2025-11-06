const profile=require("../model/profile");
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
    const {err,validate_data}=validators.profile_validator.validate(req.body);
    if(err){
        console.log("schema validation of profile fail");
        return res.send(err);
    }
    else {
            console.log('Validated Data:', value);
        }


        const bio= validate_data.bio;
        const headline=validate_data.headline;
        const location=validate_data.location
        const social=validate_data.social
        const Education=validate_data.Education;
        const Experience=validate_data.Experience;

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
    }
    catch(err){
        console.log("err:",err);
        return res.send(err);
    }

};
module.exports.updateProfile=(req,res)=>{
    return ("hi");
};
module.exports.deleteProfile=(req,res)=>{
    return ("hi");
};;