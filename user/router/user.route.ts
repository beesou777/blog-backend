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

} from "../controller/user.controller"
import {admin,protect} from "../../middlewares/auth.middleware"

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

export default router