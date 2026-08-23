import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./swagger.js";
import swaggerUiDist from "swagger-ui-dist";
import path from "path";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Serve Swagger UI static assets directly from swagger-ui-dist to ensure correct MIME types on Vercel
const swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();
app.use('/api-docs', express.static(swaggerDistPath));
// Serve the Swagger UI HTML at the docs root
app.get('/api-docs', swaggerUI.setup(swaggerDocument, { explorer: true }));

// Routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

app.get("/", (req, res) => {
    res.json({
        message: "This is the Blog API home.",
        documentation: "/api-docs"
    });
});

app.use((err, req, res, next) => {
    console.error("Express error:", err?.stack || err);

    const status = err.status || 500;

    res.status(status).json({
        error: err.message || "Internal Server Error"
    });
});

export { app };
export default app;