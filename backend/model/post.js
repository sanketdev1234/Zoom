const mongoose=require("mongoose");
const user=require("./user");
const comment=require("./comment");
const Schema= mongoose.Schema;

const PostSchema=new Schema({
    owner:{
        type:Types.Schema.ObjectId,
        ref:"user"
    },
    comments:
        [{
        type:Types.Schema.ObjectId,
        ref:"comment"
    }
],

    likeby:[
{
    type:Types.Schema.ObjectId,
    ref:"user"
}
    ],
    // Main text content of the post
    text: {
        type: String,
        required: true,
    },

    // Optional: URL to an image or video associated with the post (e.g., from Cloudinary)
    media_url: {
        type: String,
        default:null
    },
    timestamps: true
});

const post=mongoose.model("post",PostSchema);
module.exports=post;