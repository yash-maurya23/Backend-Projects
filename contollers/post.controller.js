import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

const createPost = asyncHandler(async (req, res) => {

    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
        throw new ApiError(400, "Title and content are required");
    }

    let coverImageUrl = "";

    if (req.file?.path) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload image");
        }

        coverImageUrl = uploadedImage.url;
    }

    const newPost = await Post.create({
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImageUrl,
        author: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            newPost,
            "Blog published successfully"
        )
    );
});





export { createPost };