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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./config/connect"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const error_middleware_1 = require("./middlewares/error.middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_route_1 = __importDefault(require("./routes/user.route"));
const category_router_1 = __importDefault(require("./routes/category.router"));
const post_router_1 = __importDefault(require("./routes/post.router"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
(0, connect_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5173",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.static("public"));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/users", user_route_1.default);
app.use("/api/blog", category_router_1.default);
app.use("/api/blog", post_router_1.default);
app.use("/api/blog", comment_route_1.default);
app.get("/", (req, res) => {
    res.send("Api is running on port" + PORT);
});
app.use(error_middleware_1.errorHandler);
app.use(error_middleware_1.notFound);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}));
