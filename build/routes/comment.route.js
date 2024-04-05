"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = require("../comment/controller/comment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router
    .route("/comment/:id")
    .post(auth_middleware_1.protect, comment_controller_1.createComment);
router
    .route("/comment/:id/:postId")
    .get(auth_middleware_1.protect, comment_controller_1.deleteComment);
router
    .route("/comment/update/:id")
    .get(auth_middleware_1.protect, comment_controller_1.updateComment);
exports.default = router;
