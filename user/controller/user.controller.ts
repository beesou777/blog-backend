import User from "../dto/user.model";
import generateToken from "../../utility/jwt"
import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import { cloudinary } from "../../utility/cloudinary";
// import {v2 as cloudinary} from "cloudinary"
dotenv.config()

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req ,res, next) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    profile = "https://res.cloudinary.com/dasuhyei1/image/upload/v1700654628/ueser_profile.png",
    isAdmin
  } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }
  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }
  if (!gender) {
    res.status(400);
    throw new Error("Gender is required");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  // check user exist or not
  const userExists = await User.findOne({
    email
  });

  if (userExists) {
    res.status(400)
    return next({
      message: "User already exists.",
    });
  }
  
  const user = await User.create({
    name,
    email,
    phone,
    profile,
    gender,
    password,
    isAdmin,
  });
  if (user) {
    res.status(201).json({
      user,
      token: generateToken(user._id)
    })
  }else{
    res.status(400)
    return next({
      message:"Invalid user data"
    })
  }
})

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req,res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email
  })
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      profile: user.profile,
      isAdmin: false,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    return next({
      message: "Internal server error"
    })
  }
})

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req: any, res: Response, next: any) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      profile: user.profile,
      isAdmin: false,
    })
  }else{
    res.status(401)
    return next({
      message:"User Not Found"
    })
  }
})

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async(req:any,res:Response,next:any)=>{
  const user = await User.findById(req.user._id)
    const file = req.files.profile;
    const result = await cloudinary.uploader.upload(file.tempFilePath,{ max_file_size: 20000000 });
  if(user){
    user.name = req.body.name
    user.gender = req.body.gender
    user.profile = result.url

    if(req.body.password){
      user.password = req.body.password
    }

    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      profile: user.profile,
      isAdmin: false,
    })
  }else{
    res.status(401)
    return next({
      message:"User not found"
    })
  }
})

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req:any,res:Response,next:any)=>{
  const users = await User.find({}).select("-password")
  if(users){
    res.json(users)
  }else{
    res.status(401)
    return next({
      message:"Not Authorized ,no token"
    })
  }
})

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async(req:any,res:Response,next:any)=>{
  const user = await User.findByIdAndDelete(req.params.id).select("-password")
  if(user){
    res.json({
      message:"User Removed"
    })
  }else{
    res.status(401)
    return next({
      message:"User not found"
    })
  }
})

// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req:any,res:Response,next:any)=>{
  const user = await User.findById(req.params.id).select("-password")
  if(user){
    res.json(user)
  }else{
    res.status(401)
    return next({
      message:"User Not Found"
    })
  }
})

// desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req:any,res:Response,next:any)=>{
  const user = await User.findById(req.params.id)
  if(user){
    user.name = req.body.name || req.user
    user.phone = req.body.phone || req.user
    user.gender = req.body.gender || req.user
    user.profile = req.body.profile
    user.isAdmin = req.body.isAdmin || req.user
    await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      profile: user.profile,
      isAdmin: false,
    })
  }else{
    res.status(401)
    return next({
      message:"User Not Found"
    })
  }
})

export{
  loginUser,
  registerUser,
  getUserById,
  getUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  updateUserProfile
};