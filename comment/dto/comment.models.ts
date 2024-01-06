import mongoose from "mongoose";

interface Comment {
    user:String;
    description:String;
    post:String
}

export interface commentDocument extends Comment,mongoose.Document{
    createdAt:Date,
    updatedAt:Date
}

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Comment = mongoose.model<commentDocument>("Comment",commentSchema)

export default Comment