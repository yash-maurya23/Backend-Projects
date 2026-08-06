import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js"
import Post  from "../models/post.model.js"; 

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const content = req.body?.content?.trim();

    if (!content) {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Blog post not found");
    }

    const createdComment = await Comment.create({
        content,
        post: postId,
        user: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, createdComment, "Your comment has been added"));
});

const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
        throw new ApiError(404, "Blog post not found");
    }

    const comments = await Comment.find({ post: postId })
        .populate("user", "username email avatar")
        .sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const content = req.body?.content?.trim();

    if (!content) {
        throw new ApiError(400, "Updated content cannot be empty");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Target comment does not exist");
    }

    if (comment.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized! You are not the author of this comment");
    }

    comment.content = content;
    const updatedComment = await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Target comment does not exist");
    }

    if (comment.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized! You cannot wipe this comment data");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment dropped and deleted successfully"));
});

export {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};
