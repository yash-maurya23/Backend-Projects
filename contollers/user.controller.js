import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

    } catch (error) {
        throw new ApiError(500, "Something went wrong with tokens")

    }
}
const registerUser = asyncHandler(async (req, res) => {
    //TODO LIST
    // get details from frontend->validation(ki saari detials puri di hai ya nhi)
    // ->check if user exsist->check for avatar and image->upload them in cloudinary 
    //create user obj-create db entry
    // remove pass and refresh token from field response->check for user creaton
    //return res
    const username = req.body?.username?.trim()
    const email = req.body?.email?.trim().toLowerCase()
    const password = req.body?.password?.trim()

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const exsistedUser = await User.findOne({
        $or: [{ username: { $regex: `^${username}$`, $options: 'i' } }, { email }]
    })
    if (exsistedUser) {
        throw new ApiError(409, "username already exsists")
    }

    const avatarFile = req.files?.avatar?.[0]
    const coverImageFile = req.files?.coverImage?.[0]

    const avatarLocalPath = avatarFile?.path
    const coverImageLocalPath = coverImageFile?.path

    if (!avatarFile || !avatarLocalPath) {
        throw new ApiError(400, "Avatar image required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    const user = await User.create({
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating a user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    //todo list
    //get details from user->find user->verify pass/usernme
    //save refresh token and give access token->send cookies

    const { email, username, password } = req.body
    if (!username || !password) {
        throw new ApiError(400, "Username or Password required")
    }

    const user = await User.findOne({
        $or: [{ username }, { password }]
    })
    if (!user) {
        throw new ApiError(404, "user does not exsist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await
        generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser.accessToken,
                    refreshToken
                },
                "User logged in Successfully"
            )
        )




})
//so to logout we dont have access to user id,like in login we can acces through email,pass so user can login but in logout we can not ask for pass/mail everytime
//and if someone has that can logout anyonw so here MIDDLEWARE comes in clutch


const logoutUser = asyncHandler(async (req, res) => {
    User.findById
})

export { registerUser, loginUser };