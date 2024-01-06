import express from "express"

const router = express.Router()

import {
    createPost,
    deletePost,
    dislikePost,
    fetchPost,
    fetchSinglePost,
    likePost,
    updatePost
} from "../posts/controller/post.controller"

import { admin, protect } from "../middlewares/auth.middleware"


router
    .route("/post")
    .post(protect, createPost)
    .get(protect, fetchPost)

router
    .route("/post/:id")
    .get(protect, fetchSinglePost)

router
    .route("/post/like/:id")
    .get(protect, likePost)
    .get(protect, dislikePost)

router
    .route("/post/dislike/:id")
    .get(protect, dislikePost)

router
    .route("/post/update/:id")
    .get(protect, updatePost)

router
    .route("/post/delete/:id")
    .get(protect, deletePost)
export default router