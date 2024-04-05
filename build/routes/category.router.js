"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_controller_1 = require("../category/controller/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router
    .route("/category")
    .post(auth_middleware_1.protect, category_controller_1.createCategory)
    .get(auth_middleware_1.protect, category_controller_1.getCategory);
router
    .route("/category/:id")
    .get(auth_middleware_1.protect, category_controller_1.getCategoryBySlug)
    .put(auth_middleware_1.protect, category_controller_1.updateCategory)
    .delete(auth_middleware_1.protect, category_controller_1.deleteCategory);
exports.default = router;
