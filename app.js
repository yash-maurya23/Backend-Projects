import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./swagger.js";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//routes
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)

// root route for serverless platforms that invoke this module directly
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API is running',
        documentation: '/api-docs'
    });
});

export { app }
export default app