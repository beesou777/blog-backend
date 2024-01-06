import express from "express"
const router = express.Router()
import {
    createComment,
    deleteComment,
    updateComment
} from "../comment/controller/comment.controller"
import { protect } from "../middlewares/auth.middleware"

router
    .route("/comment/:id")
    .post(protect, createComment)

router
    .route("/comment/:id/:postId")
    .get(protect, deleteComment)

router
    .route("/comment/update/:id")
    .get(protect, updateComment)
export default router