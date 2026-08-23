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

// Capture uncaught exceptions and unhandled promise rejections so Vercel logs show stack traces
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason && reason.stack ? reason.stack : reason);
});

// Serve Swagger UI files explicitly under /api-docs to avoid asset routing issues
app.use(
    "/api-docs",
    swaggerUI.serveFiles(swaggerDocument, { explorer: true }),
    swaggerUI.setup(swaggerDocument, { explorer: true })
);

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
    const docsUrl = 'https://backend-projects-omega.vercel.app/api-docs';
    res.json({
        message: 'This is the Blog API home. To view the Swagger documentation or interact with the backend, visit the URL below.',
        documentation: docsUrl
    });
});

// Generic Express error handler to ensure errors are logged and returned as JSON
app.use((err, req, res, next) => {
    console.error('Express error:', err && err.stack ? err.stack : err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export { app }
export default app