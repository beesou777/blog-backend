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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Post_models_1 = __importDefault(require("../../posts/dto/Post.models"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: [true, "phone number is required"]
    },
    gender: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: "https://res.cloudinary.com/dasuhyei1/image/upload/v1700654628/ueser_profile.png",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 4
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        enum: ["Admin", "Guest", "Editor"]
    },
    viewedBy: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    followers: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    following: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    active: {
        type: Boolean,
        default: true
    },
    posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
// initials name
// userSchema.virtual("initial").get(function(){
//   return `${this.name}`
// })
userSchema.pre("findOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = this._conditions._id;
        const posts = yield Post_models_1.default.find({ user: userId });
        const lastPost = posts[posts.length - 1];
        const lastPostDate = new Date(lastPost === null || lastPost === void 0 ? void 0 : lastPost.createdAt);
        const lastPostDateStr = lastPostDate.toDateString();
        userSchema.virtual("lastPostDate").get(function () {
            return lastPostDateStr;
        });
        // -------------check if user is inactive for 30 days ----------------
        const currentDate = new Date();
        const diff = currentDate.getDate() - lastPostDate.getDate();
        const diffInDays = diff / (1000 * 3600 * 24);
        if (diffInDays > 30) {
            userSchema.virtual("isInactive").get(function () {
                return true;
            });
        }
        else {
            userSchema.virtual("isInactive").get(function () {
                return false;
            });
        }
        const daysAgo = Math.floor(diffInDays);
        userSchema.virtual("lastActive").get(function () {
            if (daysAgo <= 0) {
                return "Today";
            }
            if (daysAgo === 1) {
                return "Yesterday";
            }
            if (daysAgo > 1) {
                return `${daysAgo} days ago`;
            }
        });
        next();
    });
});
// post count
userSchema.virtual("postCount").get(function () {
    return this.posts.length;
});
// follower count
userSchema.virtual("followerCount").get(function () {
    return this.followers.length;
});
// following count
userSchema.virtual("followingCount").get(function () {
    return this.following.length;
});
// viewers 
userSchema.virtual("viewerCount").get(function () {
    return this.viewedBy.length;
});
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
