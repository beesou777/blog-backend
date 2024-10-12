import Comment from "../../comment/dto/comment.models"
import asyncHandler from "express-async-handler"
import { Response, Request } from "express"
import User from "../../user/dto/user.model"
import Post from "../../posts/dto/Post.models"

const createComment = asyncHandler(async (req: any, res: Response, next: any) => {
    const post = await Post.findById(req.params.id)

    const comment = await Comment.create({
        user: req.user,
        post: post?._id,
        description: req.body.comment,

    })
    if (comment) {
        post?.comments.push((comment._id as string) as string)

        const user = await User.findById(req.user)
        user?.comments.push((comment._id as string) as string)

        await post?.save()
        await user?.save()

        res.json({
            data: comment
        })
    } else {
        res.status(500)
        return next({
            message: "internal server error"
        })
    }


})

const updateComment = asyncHandler(async (req: any, res: Response, next: any) => {
    const category = await Comment.findOne({ user: req.user })
    if (category) {
        category.description = req.body.comment
        await category.save()
        res.json({
            category
        })
    } else {
        res.status(400)
        return next({
            message: "description cannot be changed"
        })
    }
})


const deleteComment = asyncHandler(async (req: any, res: Response, next: any) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const post = await Post.findById(req.params.postId);
        const user = await User.findById(req.user);

        if (!comment || !user || !post) {
            res.status(400);
            return next({
                message: "Comment not found"
            });
        }

        // Check if the comment is in both the user's comments and post's comments
        const isCommentInUser = user.comments.findIndex((commentId) => commentId.toString() === (comment._id as string).toString()) !== -1;
        const isCommentInPost = post.comments.findIndex((commentId) => commentId.toString() === (comment._id as string).toString()) !== -1;

        if (isCommentInUser && isCommentInPost) {
            // Remove comment from user's comments array
            user.comments = user.comments.filter((commentId) => commentId.toString() !== (comment._id as string).toString());

            // Remove comment from post's comments array
            post.comments = post.comments.filter((commentId) => commentId.toString() !== (comment._id as string).toString());

            await user.save();
            await post.save();

            // Delete comment from Comment collection
            await Comment.findOneAndDelete({ _id: (comment._id as string) });

            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            res.status(400);
            return next({
                message: "Comment not found in user's comments or post's comments"
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

export {
    createComment,
    updateComment,
    deleteComment
}
