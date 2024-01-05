import Category from "../dto/category.model";
import asyncHandler from "express-async-handler"
import { Request, Response } from "express"

// create category
const createCategory = asyncHandler(async (req: any, res: Response, next: any) => {
    const {
        title,
        slug
    } = req.body
    if (!title) {
        res.status(400);
        throw new Error("Title is required");
    }
    if (!slug) {
        res.status(400);
        throw new Error("Slug is required");
    }

    let newSlug = slug.replace(/ /g, '-')
    const checkSlugExist = await Category.findOne({ slug: newSlug })
    if (!checkSlugExist && title && slug) {
        const category = await Category.create({
            title,
            slug: newSlug,
            user: req.user._id
        })
        await category.save()
        res.json({
            category
        })
    }else{
        res.status(400)
        return next({
            message:"slug already exist"
        })
    }
})

// get category
const getCategory = asyncHandler(async (req: any, res: Response, next: any) => {
    const category = await Category.find({})
    if (category) {
        res.json({
            category
        })
    } else {
        res.status(400)
        return next({
            message: "cannot get category"
        })
    }
})

// get categroy by slug
const getCategoryBySlug = asyncHandler(async (req: any, res: Response, next: any)=>{
    const category = await Category.findOne({slug:req.params.id})
    if(category){
        res.json({
            category
        })
    }else{
        res.status(400)
        return next({
            message:"cannot find slug"
        })
    }
})

// update category
const updateCategory = asyncHandler(async (req: any, res: Response, next: any)=>{

    const category = await Category.findOne({user:req.user})
    if(category){
        category.title = req.body.title
        await category.save()
        res.json({
            category
        })
    }else{
        res.status(400)
        return next({
            message:"title cannot be changed"
        })
    }
})
// delete category
const deleteCategory = asyncHandler(async (req: any, res: Response, next: any)=>{
    const category = await Category.findByIdAndDelete({_id:req.params.id})
    if(category){
        res.json({
            message:"successfully deleted"
        })
    }else{
        res.status(400)
        return next({
            message:"unable to delete this category"
        })
    }
})


export {
    createCategory,
    getCategory,
    getCategoryBySlug,
    updateCategory,
    deleteCategory
}