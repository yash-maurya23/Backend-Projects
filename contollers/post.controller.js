import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"


const post=asyncHandler(async(req,res)=>{
    const title=req.body?.title?.trim()
    const content=req.body?.content?.trim()


})