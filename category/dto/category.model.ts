import mongoose from "mongoose";

interface Category {
    user:String;
    title:String;
    slug:String;
}

export interface categoryDocument extends Category,mongoose.Document{
    createdAt:Date,
    updatedAt:Date
}

const categorySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        unique:true,
        required:true,
        trim:true
    }
},{
    timestamps:true
})

const Category = mongoose.model<categoryDocument>("Category",categorySchema)

export default Category