import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

// ================= CREATE POST =================
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
            "Blog post published successfully"
        )
    );
});

// ================= GET ALL POSTS =================
const getAllPosts = asyncHandler(async (req, res) => {

    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author", "username email avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "All blog posts fetched successfully"
        )
    );
});

// ================= GET POST BY ID =================
const getPostById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id)
        .populate("author", "username email avatar");

    if (!post) {
        throw new ApiError(404, "Blog post not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Blog post fetched successfully"
        )
    );
});

// ================= UPDATE POST =================
const updatePost = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Blog post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Unauthorized! You are not the owner of this post"
        );
    }

    if (title?.trim()) {
        post.title = title.trim();
    }

    if (content?.trim()) {
        post.content = content.trim();
    }

    if (req.file?.path) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload image");
        }

        post.coverImage = uploadedImage.url;
    }

    const updatedPost = await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPost,
            "Blog post updated successfully"
        )
    );
});

// ================= DELETE POST =================
const deletePost = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Blog post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Unauthorized! You are not the owner of this post"
        );
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Blog post deleted successfully"
        )
    );
});

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};