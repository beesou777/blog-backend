"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../user/controller/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.route("/").get(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.getUsers);
router.route("/register").post(user_controller_1.registerUser);
router.post("/login", user_controller_1.loginUser);
router
    .route("/profile")
    .get(auth_middleware_1.protect, user_controller_1.getUserProfile)
    .put(auth_middleware_1.protect, user_controller_1.updateUserProfile);
router
    .route("/:id")
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.deleteUser)
    .get(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.getUserById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.updateUser);
router
    .route("/profile-viewer/:id")
    .get(auth_middleware_1.protect, user_controller_1.profileViwe);
router
    .route("/following/:id")
    .get(auth_middleware_1.protect, user_controller_1.followingUser);
router
    .route("/un-follow/:id")
    .get(auth_middleware_1.protect, user_controller_1.unfollowUser);
exports.default = router;
