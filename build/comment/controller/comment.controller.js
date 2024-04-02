"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const comment_models_1 = __importDefault(require("../../comment/dto/comment.models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../../user/dto/user.model"));
const Post_models_1 = __importDefault(require("../../posts/dto/Post.models"));
const createComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.findById(req.params.id);
    const comment = yield comment_models_1.default.create({
        user: req.user,
        post: post === null || post === void 0 ? void 0 : post._id,
        description: req.body.comment,
    });
    if (comment) {
        post === null || post === void 0 ? void 0 : post.comments.push(comment._id);
        const user = yield user_model_1.default.findById(req.user);
        user === null || user === void 0 ? void 0 : user.comments.push(comment._id);
        yield (post === null || post === void 0 ? void 0 : post.save());
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.json({
            data: comment
        });
    }
    else {
        res.status(500);
        return next({
            message: "internal server error"
        });
    }
}));
exports.createComment = createComment;
const updateComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield comment_models_1.default.findOne({ user: req.user });
    if (category) {
        category.description = req.body.comment;
        yield category.save();
        res.json({
            category
        });
    }
    else {
        res.status(400);
        return next({
            message: "description cannot be changed"
        });
    }
}));
exports.updateComment = updateComment;
const deleteComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_models_1.default.findById(req.params.id);
        const post = yield Post_models_1.default.findById(req.params.postId);
        const user = yield user_model_1.default.findById(req.user);
        if (!comment || !user || !post) {
            res.status(400);
            return next({
                message: "Comment not found"
            });
        }
        // Check if the comment is in both the user's comments and post's comments
        const isCommentInUser = user.comments.findIndex((commentId) => commentId.toString() === comment._id.toString()) !== -1;
        const isCommentInPost = post.comments.findIndex((commentId) => commentId.toString() === comment._id.toString()) !== -1;
        if (isCommentInUser && isCommentInPost) {
            // Remove comment from user's comments array
            user.comments = user.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
            // Remove comment from post's comments array
            post.comments = post.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
            yield user.save();
            yield post.save();
            // Delete comment from Comment collection
            yield comment_models_1.default.findOneAndDelete({ _id: comment._id });
            res.status(200).json({ message: "Comment deleted successfully" });
        }
        else {
            res.status(400);
            return next({
                message: "Comment not found in user's comments or post's comments"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500);
        return next({
            message: "Internal Server Error"
        });
    }
}));
exports.deleteComment = deleteComment;
