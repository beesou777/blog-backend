import mongoose from "mongoose";

interface Post {
    title:String;
    description:String;
    category:String;
    numViews:String[];
    likes:String[];
    disLikes:String[];
    user:String;
    image:String;
    slug:String
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
    slug:{
        type:String,
        unique:true,
        required:true
    }
},{
    toJSON:{virtuals:true},
    timestamps:true
})

postSchema.pre(/^find/,function(this:any,next:any){

    postSchema.virtual("likeCount").get(function(){
        const post  = this;
        return post?.likes.length
    })
    
    postSchema.virtual("dislikeCount").get(function(){
        const post  = this;
        return post?.disLikes.length
    })
    
    postSchema.virtual("daysAgo").get(function(){
        const post  = this;
        const currentDate = new Date();
        const date = new Date(post?.createdAt);
        const daysAgo = Math.floor(currentDate.getDate() - date.getDate())
    
        return daysAgo === 0 
        ? "Today" 
        : daysAgo === 1 
        ? "Yesterday" 
        : `${daysAgo} days ago` 
    })
    next()

})

const Post = mongoose.model<postDocument>("Post",postSchema)

export default Post
