import jwt from "jsonwebtoken";
import User from "../user/dto/user.model";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()

const protect = asyncHandler(async (
  req: any, res: Response, next: NextFunction) => {
  let token: any;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY || '')

      req.user = await User.findById(decode.sub).select("-password")
      if (!req.user || req.user == null) {
        res.status(404)
        throw new Error("user is not found")
      }
      next()
    } catch (error) {
      console.log(error)
      res.status(403).json({ message: "Not Authorized,token expire" })
    }
  }
  if (!token) {
    res.status(403);
    throw new Error("Not authorized, no token");
  }
})


const admin = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  if (req.user &&  req.user.isAdmin == false || req.user.isAdmin == true) {
    next()
  } else {
    res.status(403)
    throw new Error("User is not authenticated")
  }
})

export {
  protect,
  admin,
}
