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
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getCategory = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../dto/category.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// create category
const createCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required");
    }
    const category = yield category_model_1.default.create({
        title,
        user: req.user._id
    });
    if (category) {
        yield category.save();
        res.json({
            category
        });
    }
    else {
        res.status(400);
        return next({
            message: "slug already exist"
        });
    }
}));
exports.createCategory = createCategory;
// get category
const getCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.find({});
    if (category) {
        res.json({
            category
        });
    }
    else {
        res.status(400);
        return next({
            message: "cannot get category"
        });
    }
}));
exports.getCategory = getCategory;
// get categroy by slug
const getCategoryBySlug = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findOne({ slug: req.params.id });
    if (category) {
        res.json({
            category
        });
    }
    else {
        res.status(400);
        return next({
            message: "cannot find slug"
        });
    }
}));
exports.getCategoryBySlug = getCategoryBySlug;
// update category
const updateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findOne({ user: req.user });
    if (category) {
        category.title = req.body.title;
        yield category.save();
        res.json({
            category
        });
    }
    else {
        res.status(400);
        return next({
            message: "title cannot be changed"
        });
    }
}));
exports.updateCategory = updateCategory;
// delete category
const deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findByIdAndDelete({ _id: req.params.id });
    if (category) {
        res.json({
            message: "successfully deleted"
        });
    }
    else {
        res.status(400);
        return next({
            message: "unable to delete this category"
        });
    }
}));
exports.deleteCategory = deleteCategory;
