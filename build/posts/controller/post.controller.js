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
exports.updatePost = exports.deletePost = exports.fetchSinglePost = exports.dislikePost = exports.likePost = exports.fetchPost = exports.createPost = void 0;
const user_model_1 = __importDefault(require("../../user/dto/user.model"));
const Post_models_1 = __importDefault(require("../../posts/dto/Post.models"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cloudinary_1 = require("../../utility/cloudinary");
const string_1 = require("../../utility/string");
const createPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, slug, category } = req.body;
    if (!title) {
        res.status(400);
        return next({
            message: "title is required"
        });
    }
    if (!description) {
        res.status(400);
        return next({
            message: "description is required"
        });
    }
    if (!slug) {
        res.status(400);
        return next({
            message: "description is required"
        });
    }
    const file = req.files.image;
    const result = yield cloudinary_1.cloudinary.uploader.upload(file.tempFilePath);
    const author = yield user_model_1.default.findById(req.user);
    const postCreated = yield Post_models_1.default.create({
        title,
        description,
        category,
        slug: (0, string_1.convertToSlug)(slug),
        image: result.url,
        user: author === null || author === void 0 ? void 0 : author._id
    });
    if (postCreated) {
        author === null || author === void 0 ? void 0 : author.posts.push(postCreated._id);
        yield (author === null || author === void 0 ? void 0 : author.save());
        res.json({
            status: true,
            data: postCreated
        });
    }
}));
exports.createPost = createPost;
const fetchPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.find({})
        .populate({
        path: "user",
        select: "-password",
    })
        .populate("category", "title");
    if (post) {
        res.json({
            status: "Success",
            data: post
        });
    }
    else {
        res.status(400);
        return next({
            message: "cannot get post"
        });
    }
}));
exports.fetchPost = fetchPost;
const likePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.findById(req.params.id);
    const userWhoLike = req.user;
    if (post && userWhoLike) {
        const isPostAlreadyLikeIndex = post.likes.findIndex(like => like.toString() === userWhoLike._id.toString());
        const isPostAlreadyDislikeIndex = post.disLikes.findIndex(like => like.toString() === userWhoLike._id.toString());
        if (isPostAlreadyDislikeIndex !== -1) {
            post.disLikes.splice(isPostAlreadyDislikeIndex, 1);
        }
        if (isPostAlreadyLikeIndex === -1) {
            post.likes.push(userWhoLike._id);
        }
        else {
            post.likes.splice(isPostAlreadyLikeIndex, 1);
        }
        yield post.save();
        res.json({
            success: true,
            post,
        });
    }
    else {
        res.status(400);
        return next({
            message: "Internal server error",
        });
    }
}));
exports.likePost = likePost;
const dislikePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.findById(req.params.id);
    const userWhoDislike = req.user;
    if (post && userWhoDislike) {
        const isPostAlreadyLikeIndex = post.likes.findIndex(like => like.toString() === userWhoDislike._id.toString());
        const isPostAlreadyDislikeIndex = post.disLikes.findIndex(like => like.toString() === userWhoDislike._id.toString());
        if (isPostAlreadyLikeIndex !== -1) {
            post.likes.splice(isPostAlreadyLikeIndex, 1);
        }
        if (isPostAlreadyDislikeIndex === -1) {
            post.disLikes.push(userWhoDislike._id);
        }
        else {
            post.disLikes.splice(isPostAlreadyDislikeIndex, 1);
        }
        yield post.save();
        res.json({
            success: true,
            post,
        });
    }
    else {
        res.status(400);
        return next({
            message: "Internal server error",
        });
    }
}));
exports.dislikePost = dislikePost;
const fetchSinglePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.findById(req.params.id);
    if (post) {
        res.json({
            status: true,
            data: post
        });
    }
    else {
        res.status(400);
        return next({
            message: "cannot get post"
        });
    }
}));
exports.fetchSinglePost = fetchSinglePost;
const deletePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_models_1.default.findById(req.params.id);
        const user = yield user_model_1.default.findById(req.user);
        if (!post || !user) {
            res.status(400);
            return next({
                message: "Post not found"
            });
        }
        const isPostInUserPosts = user.posts.findIndex((postId) => postId.toString() === post._id.toString());
        if (isPostInUserPosts !== -1) {
            user.posts.splice(isPostInUserPosts, 1);
            yield user.save();
            // Delete post from Post collection
            yield Post_models_1.default.findOneAndDelete({ _id: post._id });
            res.status(200).json({ message: "Post deleted successfully" });
        }
        else {
            res.status(400);
            return next({
                message: "Post not found in user's posts"
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
exports.deletePost = deletePost;
const updatePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_models_1.default.findById(req.params.id);
    if (post) {
        post.title = req.body.title;
        post.description = req.body.description;
        post.category = req.body.category;
        yield post.save();
        res.json({
            success: true,
            data: post
        });
    }
    else {
        res.status(400);
        return next({
            message: "Cannor update post"
        });
    }
}));
exports.updatePost = updatePost;
