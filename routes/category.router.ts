import express from "express"
const router = express.Router()

import {
    createCategory,
    deleteCategory,
    getCategory,
    getCategoryBySlug,
    updateCategory
} from "../category/controller/category.controller"

import { admin, protect } from "../middlewares/auth.middleware"


router
    .route("/category")
    .post(protect, createCategory)
    .get(protect, getCategory)

router
    .route("/category/:id")
    .get(protect, getCategoryBySlug)
    .put(protect,updateCategory)
    .delete(protect,deleteCategory)

export default router