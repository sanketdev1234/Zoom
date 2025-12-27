const profile=require("../model/profile");
const connection=require("../model/connections");

module.exports.search_by_profile=async(req,res)=>{
    const {query}=req.query;
    try{
    const require_profile=await profile.find({
        $or:[{headline:{$regex: query , $option:"i"}},{bio:{$regex: query,$option:"i"}},{location:{$regex: query  , $option:"i"}}]
    }).populate("owner");
    console.log(require_profile);
    res.send(`your search result ${require_profile}`)
    }
    catch(error){
        console.log(error);
        return res.send(error);
    }
}

module.exports.suggestions=async(req,res)=>{
    const userid=req.user._id;
    try{
    const excluded_connection=await connection.find({$or:[{sender:userid},{receiver:userid}]});
    const excludedid=excluded_connection.map((conn)=>(conn.sender.toString()===userid.toString())?conn.receiver:conn.sender);
    excludedid.push(userid);

    const user_profile=await profile.find({owner:userid});
    if(!user_profile){
        res.send("create a profile to get the suggestion");
    }
   
    const suggestions=await profile.findOne({  
        owner:{$nin:excludedid},
        $or:[{location:user_profile.location},{"Education.school":{$in:user_profile.Education.map((e)=>e.school)}},
            {"Education.degree":{$in:user_profile.Education?.map((e)=>e.degree) || []}},
            {"Education.field_of_study":{$in:user_profile.Education?.map((e)=>e.field_of_study) || []}},
             {"Experience.company":{$in:user_profile.Experience?.map((e)=>e.company) || []}},
              {"Experience.title":{$in:user_profile.Experience?.map((e)=>e.title) || []}},
        ]
    }).limit(10).populate("owner")
   
    if(!suggestions || suggestions.length === 0){
        res.send("oops no suggestion matching your profile")
    }
    res.send(`suggested profile ${suggestions}`);
    }
    catch(error){
        console.log(error);
        return res.send(error);
    }
}