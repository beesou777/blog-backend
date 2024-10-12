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
exports.unfollowUser = exports.followingUser = exports.profileViwe = exports.updateUserProfile = exports.updateUser = exports.deleteUser = exports.getUsers = exports.getUserProfile = exports.getUserById = exports.registerUser = exports.loginUser = void 0;
const user_model_1 = __importDefault(require("../dto/user.model"));
const jwt_1 = __importDefault(require("../../utility/jwt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("../../utility/cloudinary");
// import {v2 as cloudinary} from "cloudinary"
dotenv_1.default.config();
// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone, gender, profile = "https://res.cloudinary.com/dasuhyei1/image/upload/v1700654628/ueser_profile.png" } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Name is required");
    }
    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }
    if (!phone) {
        res.status(400);
        throw new Error("Phone number is required");
    }
    if (!gender) {
        res.status(400);
        throw new Error("Gender is required");
    }
    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }
    // check user exist or not
    const userExists = yield user_model_1.default.findOne({
        email
    });
    if (userExists) {
        res.status(400);
        return next({
            message: "User already exists.",
        });
    }
    const user = yield user_model_1.default.create({
        name,
        email,
        phone,
        profile,
        gender,
        password
    });
    if (user) {
        res.status(201).json({
            user,
            token: (0, jwt_1.default)(user._id),
        });
    }
    else {
        res.status(400);
        return next({
            message: "Invalid user data"
        });
    }
}));
exports.registerUser = registerUser;
// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({
        email
    });
    if (user && (yield user.comparePassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile: user.profile,
            isAdmin: false,
            token: (0, jwt_1.default)(user._id),
        });
    }
    else {
        res.status(400);
        return next({
            message: "Internal server error"
        });
    }
}));
exports.loginUser = loginUser;
// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user._id).select("-password");
    if (user) {
        res.json({
            user
        });
    }
    else {
        res.status(401);
        return next({
            message: "User Not Found"
        });
    }
}));
exports.getUserProfile = getUserProfile;
// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user._id);
    const file = req.files.profile;
    const result = yield cloudinary_1.cloudinary.uploader.upload(file.tempFilePath, { max_file_size: 20000000 });
    if (user) {
        user.name = req.body.name;
        user.gender = req.body.gender;
        user.profile = result.url;
        if (req.body.password) {
            user.password = req.body.password;
        }
        yield user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            profile: user.profile,
            isAdmin: false,
        });
    }
    else {
        res.status(401);
        return next({
            message: "User not found"
        });
    }
}));
exports.updateUserProfile = updateUserProfile;
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({}).select("-password");
    if (users) {
        res.json(users);
    }
    else {
        res.status(401);
        return next({
            message: "Not Authorized ,no token"
        });
    }
}));
exports.getUsers = getUsers;
// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(req.params.id).select("-password");
    if (user) {
        res.json({
            message: "User Removed"
        });
    }
    else {
        res.status(401);
        return next({
            message: "User not found"
        });
    }
}));
exports.deleteUser = deleteUser;
// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id).select("-password");
    if (user) {
        res.json(user);
    }
    else {
        res.status(401);
        return next({
            message: "User Not Found"
        });
    }
}));
exports.getUserById = getUserById;
// desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id);
    if (user) {
        user.name = req.body.name || req.user;
        user.phone = req.body.phone || req.user;
        user.gender = req.body.gender || req.user;
        user.profile = req.body.profile;
        user.isAdmin = req.body.isAdmin || req.user;
        yield user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            profile: user.profile,
            isAdmin: false,
        });
    }
    else {
        res.status(401);
        return next({
            message: "User Not Found"
        });
    }
}));
exports.updateUser = updateUser;
// desc get views
// @route PUT /api/users/profile-viewer/:id
// @access Private
const profileViwe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id);
    const whoViewd = yield user_model_1.default.findById(req.user);
    if (user && whoViewd) {
        const isUserAlreadyViewed = user.viewedBy.find(viewer => viewer.toString() === whoViewd._id.toString());
        if (isUserAlreadyViewed) {
            return next({
                message: "Already viewed"
            });
        }
        else {
            user.viewedBy.push(whoViewd._id);
            yield user.save();
            res.json({ message: "successfully viewed" });
        }
    }
}));
exports.profileViwe = profileViwe;
const followingUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToFollow = yield user_model_1.default.findById(req.params.id);
        const userWhoFollowed = yield user_model_1.default.findById(req.user);
        if (userToFollow && userWhoFollowed && (userToFollow === null || userToFollow === void 0 ? void 0 : userToFollow._id).toString() !== (userWhoFollowed === null || userWhoFollowed === void 0 ? void 0 : userWhoFollowed._id).toString()) {
            const isUserAlreadyFollowed = userWhoFollowed.following.find(follower => follower.toString() === userToFollow._id.toString());
            if (isUserAlreadyFollowed) {
                return res.status(400).json({
                    message: "Already followed"
                });
            }
            else {
                userToFollow.followers.push(userWhoFollowed._id);
                userWhoFollowed.following.push(userToFollow._id);
                yield userWhoFollowed.save();
                yield userToFollow.save();
                return res.json({
                    message: "Successfully followed"
                });
            }
        }
        else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    }
    catch (error) {
        return next(error);
    }
}));
exports.followingUser = followingUser;
const unfollowUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userToBeunFollow = yield user_model_1.default.findById(req.params.id); // profile to unfollow
    const userWhoUnfollowed = yield user_model_1.default.findById(req.user); // logined user
    if (userToBeunFollow && userWhoUnfollowed && (userToBeunFollow === null || userToBeunFollow === void 0 ? void 0 : userToBeunFollow._id).toString() !== (userWhoUnfollowed === null || userWhoUnfollowed === void 0 ? void 0 : userWhoUnfollowed._id).toString()) {
        const isUserAlreadyFollowed = userToBeunFollow.followers.find(follower => follower.toString() === userWhoUnfollowed._id.toString());
        if (!isUserAlreadyFollowed) {
            return next({
                message: "you have not followed this user"
            });
        }
        else {
            userToBeunFollow.followers = userToBeunFollow.followers.filter(follower => follower.toString() !== userWhoUnfollowed._id.toString());
            yield userToBeunFollow.save();
            userWhoUnfollowed.following = userWhoUnfollowed.following.filter(following => following.toString() !== userToBeunFollow._id.toString());
            yield userWhoUnfollowed.save();
            res.json({
                message: "Successfully unFollowed"
            });
        }
    }
    else {
        return res.status(404).json({
            message: "User not found"
        });
    }
}));
exports.unfollowUser = unfollowUser;
