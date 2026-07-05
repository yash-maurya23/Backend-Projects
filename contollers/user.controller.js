import {asyncHandler} from "../utils/asyncHandler.js";



const registerUser=asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})

//TODO LIST
// get details from frontend->validation(ki saari detials puri di hai ya nhi)
// ->check if user exsist->check for avatar and image->upload them in cloudinary 
//create user obj-create db entry
// remove pass and refresh token from field response->check for user creaton
//return res


export {registerUser};