import mongoose from "mongoose";
import  bcrypt from "bcryptjs"

export interface User {
  name: string;
  email: string;
  phone: number;
  gender: string;
  profile: string;
  password: string;
  isAdmin: boolean;
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
  }

},{timestamps:true});


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
