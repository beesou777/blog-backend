import express from "express"
const router = express.Router()

import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  profileViwe,
  followingUser,
  unfollowUser,

} from "../controller/user.controller"
import { admin, protect } from "../../middlewares/auth.middleware"

router.route("/").get(protect, admin, getUsers);

router.route("/register").post(registerUser);

router.post("/login", loginUser);
// 
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// 
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

router
  .route("/profile-viewer/:id")
  .get(protect, profileViwe)

router
  .route("/following/:id")
  .get(protect, followingUser)
router
  .route("/un-follow/:id")
  .get(protect, unfollowUser)
export default router