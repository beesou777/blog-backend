import User from "../../user/dto/user.model";
import Post from "../../posts/dto/Post.models";
import asyncHandler from "express-async-handler"
import { Request, Response } from "express";
import { cloudinary } from "../../utility/cloudinary";
import { convertToSlug } from "../../utility/string";

const createPost = asyncHandler(async (req: any, res: Response, next: any) => {
    const { title, description, slug, category } = req.body

    if (!title) {
        res.status(400)
        return next({
            message: "title is required"
        })
    }
    if (!description) {
        res.status(400)
        return next({
            message: "description is required"
        })
    }
    if (!slug) {
        res.status(400)
        return next({
            message: "description is required"
        })
    }

    const file = req.files.image
    const result = await cloudinary.uploader.upload(file.tempFilePath)

    const author = await User.findById(req.user)

    const postCreated = await Post.create({
        title,
        description,
        category,
        slug: convertToSlug(slug),
        image: result.url,
        user: author?._id
    })

    if (postCreated) {
        author?.posts.push(postCreated._id as string)
        await author?.save()
        res.json({
            status: true,
            data: postCreated
        })
    }
})

const fetchPost = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.find({})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate("category", "title")
    if (post) {
        res.json({
            status: "Success",
            data: post
        })
    } else {
        res.status(400)
        return next({
            message: "cannot get post"
        })
    }
})

const likePost = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.findById(req.params.id);
    const userWhoLike = req.user;

    if (post && userWhoLike) {
        const isPostAlreadyLikeIndex = post.likes.findIndex(like => like.toString() === userWhoLike._id.toString());
        const isPostAlreadyDislikeIndex = post.disLikes.findIndex(like => like.toString() === userWhoLike._id.toString());

        if (isPostAlreadyDislikeIndex !== -1) {
            post.disLikes.splice(isPostAlreadyDislikeIndex, 1);
        }

        if (isPostAlreadyLikeIndex === -1) {
            post.likes.push(userWhoLike._id);
        } else {
            post.likes.splice(isPostAlreadyLikeIndex, 1);
        }

        await post.save();
        res.json({
            success: true,
            post,
        });
    } else {
        res.status(400)
        return next({
            message: "Internal server error",
        });
    }
});

const dislikePost = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.findById(req.params.id);
    const userWhoDislike = req.user;

    if (post && userWhoDislike) {
        const isPostAlreadyLikeIndex = post.likes.findIndex(like => like.toString() === userWhoDislike._id.toString());
        const isPostAlreadyDislikeIndex = post.disLikes.findIndex(like => like.toString() === userWhoDislike._id.toString());

        if (isPostAlreadyLikeIndex !== -1) {
            post.likes.splice(isPostAlreadyLikeIndex, 1);
        }

        if (isPostAlreadyDislikeIndex === -1) {
            post.disLikes.push(userWhoDislike._id);
        } else {
            post.disLikes.splice(isPostAlreadyDislikeIndex, 1);
        }

        await post.save();
        res.json({
            success: true,
            post,
        });
    } else {
        res.status(400)
        return next({
            message: "Internal server error",
        });
    }
});

const fetchSinglePost = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.findById(req.params.id)
    if (post) {
        res.json({
            status: true,
            data: post
        })
    } else {
        res.status(400)
        return next({
            message: "cannot get post"
        })
    }
})

const deletePost = asyncHandler(async (req: any, res: Response, next: any) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user);

        if (!post || !user) {
            res.status(400);
            return next({
                message: "Post not found"
            });
        }

        const isPostInUserPosts = user.posts.findIndex((postId) => postId.toString() === (post._id as string).toString());

        if (isPostInUserPosts !== -1) {
            user.posts.splice(isPostInUserPosts, 1);
            await user.save();

            // Delete post from Post collection
            await Post.findOneAndDelete({ _id: post._id });

            res.status(200).json({ message: "Post deleted successfully" });
        } else {
            res.status(400);
            return next({
                message: "Post not found in user's posts"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500);
        return next({
            message: "Internal Server Error"
        });
    }
});

const updatePost = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.findById(req.params.id)

    if (post) {
        post.title = req.body.title
        post.description = req.body.description
        post.category = req.body.category

        await post.save()
        res.json({
            success: true,
            data: post
        })
    } else {
        res.status(400)
        return next({
            message: "Cannor update post"
        })
    }

})

export {
    createPost,
    fetchPost,
    likePost,
    dislikePost,
    fetchSinglePost,
    deletePost,
    updatePost
}