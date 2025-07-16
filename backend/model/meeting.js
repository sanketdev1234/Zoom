const mongoose=require("mongoose");
const user=require("./user");
const chat=require("./chat");
const Schema=mongoose.Schema;

const meetingSchema=new Schema({
    Hosted_by:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:[true,"Host required"]
    },
    Joining_id:{
        type:String,
        required:[true,"cannot joined using meeting joining id"]
    },
    StartAt:{
        type:Date,
        required:[true,"Start time  required"],
    },
    EndAt:{
        type:Date,
    },
    Participants:[
    { type:Schema.Types.ObjectId,
        ref:"user"
    }
    ],
    Chats:[
        {
            type:Schema.Types.ObjectId,
            ref:"chat"
        }
    ]

});
const meeting=mongoose.model("meeting",meetingSchema);
module.exports=meeting;