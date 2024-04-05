"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    numViews: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    disLikes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    toJSON: { virtuals: true },
    timestamps: true
});
postSchema.pre(/^find/, function (next) {
    postSchema.virtual("likeCount").get(function () {
        const post = this;
        return post === null || post === void 0 ? void 0 : post.likes.length;
    });
    postSchema.virtual("dislikeCount").get(function () {
        const post = this;
        return post === null || post === void 0 ? void 0 : post.disLikes.length;
    });
    postSchema.virtual("daysAgo").get(function () {
        const post = this;
        const currentDate = new Date();
        const date = new Date(post === null || post === void 0 ? void 0 : post.createdAt);
        const daysAgo = Math.floor(currentDate.getDate() - date.getDate());
        return daysAgo === 0
            ? "Today"
            : daysAgo === 1
                ? "Yesterday"
                : `${daysAgo} days ago`;
    });
    next();
});
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
