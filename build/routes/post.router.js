"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = require("../posts/controller/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router
    .route("/post")
    .post(auth_middleware_1.protect, post_controller_1.createPost)
    .get(auth_middleware_1.protect, post_controller_1.fetchPost);
router
    .route("/post/:id")
    .get(auth_middleware_1.protect, post_controller_1.fetchSinglePost);
router
    .route("/post/like/:id")
    .get(auth_middleware_1.protect, post_controller_1.likePost)
    .get(auth_middleware_1.protect, post_controller_1.dislikePost);
router
    .route("/post/dislike/:id")
    .get(auth_middleware_1.protect, post_controller_1.dislikePost);
router
    .route("/post/update/:id")
    .get(auth_middleware_1.protect, post_controller_1.updatePost);
router
    .route("/post/delete/:id")
    .get(auth_middleware_1.protect, post_controller_1.deletePost);
exports.default = router;
