import cookieParser from "cookie-parser"
import express from "express";
import cors from 'cors'
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js' 
//routes declaration

app.use("/api/v1/users",userRouter)//ye as prefix kaam karega like  http://localhost:3000/users/register ya to /login /logout aaise work karega
app.use("/api/v1/posts", postRouter)
export {app}