import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerUiDist from "swagger-ui-dist";
import swaggerDocument from "./swagger.js";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";

const app = express();


// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Swagger
const swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();

app.use("/api-docs", express.static(swaggerDistPath));

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
);


// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);


// Home
app.get("/", (req, res) => {
    res.json({
        message: "This is the Blog API home.",
        documentation: "/api-docs"
    });
});


// Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

export { app };
export default app;