import mongoose from "mongoose";

interface Post {
    title:String;
    description:String;
    category:String;
    numViews:String[];
    likes:String[];
    disLikes:String[];
    user:String;
    image:String
}

export interface postDocument extends Post,mongoose.Document{
    createdAt:Date,
    UpdatedAt:Date
}

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    numViews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String,
        required:true,
    },
},{
    timestamps:true
})


const Post = mongoose.model<postDocument>("Post",postSchema)

export default Post
