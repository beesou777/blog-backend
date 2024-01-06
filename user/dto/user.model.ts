import mongoose from "mongoose";
import  bcrypt from "bcryptjs"
import Post from "../../posts/dto/Post.models";

interface User {
  name: string;
  email: string;
  phone: string;
  gender: string;
  profile: string;
  password: string;
  isAdmin: boolean;
  role:String;
  viewedBy:String[];
  followers:String[];
  following:String[];
  postCount:Number;
  active:Boolean;
  posts:String[];
  createdAt:Date;
  updatedAt:Date;
}

export interface UserDocument extends User,mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required:true,
    unique:true
  },
  phone:{
    type:Number,
    required:[true,"phone number is required"]
  },
  gender: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: "https://res.cloudinary.com/dasuhyei1/image/upload/v1700654628/ueser_profile.png",
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minlength:4
  },
  isAdmin:{
    type: Boolean,
    required: true,
    default: false,
  },
  role:{
    type:String,
     enum:["Admin","Guest","Editor"]
  },
  viewedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  active:{
    type:Boolean,
    default:true
  },
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
    }
  ]

},{
  timestamps:true,
  toJSON:{virtuals:true}
});

// initials name
// userSchema.virtual("initial").get(function(){
//   return `${this.name}`
// })

userSchema.pre("findOne",async function(this:any,next:any){
  const userId = this._conditions._id
  const posts = await Post.find({user:userId})
  const lastPost = posts[posts.length - 1]
  const lastPostDate = new Date(lastPost?.createdAt)
  const lastPostDateStr = lastPostDate.toDateString()

  userSchema.virtual("lastPostDate").get(function(){
    return lastPostDateStr
  })

  // -------------check if user is inactive for 30 days ----------------
  const currentDate = new Date();
  const diff = currentDate.getDate() - lastPostDate.getDate()
  const diffInDays = diff/(1000*3600 * 24)
  
  if(diffInDays > 30){
    userSchema.virtual("isInactive").get(function(){
      return true
    })
  }else{
    userSchema.virtual("isInactive").get(function(){
      return false
    })
  }

  const daysAgo = Math.floor(diffInDays)
  userSchema.virtual("lastActive").get(function(){
    if(daysAgo <= 0){
      return "Today"
    }
    if(daysAgo === 1){
      return "Yesterday"
    }
    if(daysAgo > 1){
      return `${daysAgo} days ago`
    }
  })
  next()
})


// post count
userSchema.virtual("postCount").get(function(){
  return this.posts.length
})

// follower count
userSchema.virtual("followerCount").get(function(){
  return this.followers.length
})

// following count
userSchema.virtual("followingCount").get(function(){
  return this.following.length
})

// viewers 
userSchema.virtual("viewerCount").get(function (){
  return this.viewedBy.length
})

userSchema.methods.comparePassword = async function(
  enteredPassword:string
):Promise <Boolean>{
  return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})


const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
