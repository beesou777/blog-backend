import express, { Express, Request, Response, response } from "express"
import cors from "cors"
import connectDB from "./config/connect"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import bodyParser from "body-parser"
import compression from "compression"
import { errorHandler, notFound } from "./middlewares/error.middleware"
import dotenv from "dotenv"
dotenv.config();

import userRoute from "./user/router/user.route"
import categoryRoute from "./category/router/category.router"
import postRoute from "./posts/router/post.router"

connectDB()

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(compression());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Api is running on port" + PORT)
})

app.use("/api/users", userRoute);
app.use("/api/blog",categoryRoute)
app.use("/api/blog",postRoute)

app.use(errorHandler)
app.use(notFound)


app.listen(PORT, async () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
