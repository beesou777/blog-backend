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

import userRoute from "./routes/user.route"
import categoryRoute from "./routes/category.router"
import postRoute from "./routes/post.router"
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


connectDB()

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

const options = {
  definition:{
    openapi:'3.0.0',
    info:{
      title:"blog title",
      version:'1.0.0'
    },
    servers:[
      {
        url : 'http://localhost:8000/'
      }
    ]
  },
  apis:['./routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)


app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))
app.use(compression());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/users", userRoute);
app.use("/api/blog",categoryRoute)
app.use("/api/blog",postRoute)

app.use("/api",swaggerUi.serve,swaggerUi.setup(swaggerSpec))
/**
 * @swagger
 * /:
 *  get:
 *      summary:this api is used to check if get method is working
 *      description : this api is used to check if get method is working
 *      responses:
 *            200:
 *                description: To test get method
 */

app.get("/", (req: Request, res: Response) => {
  res.send("Api is running on port" + PORT)
})


app.use(errorHandler)
app.use(notFound)


app.listen(PORT, async () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
