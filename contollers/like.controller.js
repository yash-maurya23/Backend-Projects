import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const likeItem = asyncHandler(async (req, res) => {
    const { itemId, itemType } = req.params;
    const userId = req.user._id;

    if (!["Post", "Comment"].includes(itemType)) {
        throw new ApiError(400, "itemType must be Post or Comment");
    }

    const target = itemType === "Post"
        ? await Post.exists({ _id: itemId })
        : await Comment.exists({ _id: itemId });

    if (!target) {
        throw new ApiError(404, `${itemType} not found`);
    }

    const existingLike = await Like.findOne({ likedItem: itemId, itemType, user: userId });
    if (existingLike) {
        return res.status(200).json(new ApiResponse(200, existingLike, "Already liked"));
    }

    const createdLike = await Like.create({
        user: userId,
        likedItem: itemId,
        itemType
    });

    return res.status(201).json(new ApiResponse(201, createdLike, "Item liked successfully"));
});

const unlikeItem = asyncHandler(async (req, res) => {
    const { itemId, itemType } = req.params;
    const userId = req.user._id;

    if (!["Post", "Comment"].includes(itemType)) {
        throw new ApiError(400, "itemType must be Post or Comment");
    }

    const removed = await Like.findOneAndDelete({ likedItem: itemId, itemType, user: userId });
    if (!removed) {
        throw new ApiError(404, "Like not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Item unliked successfully"));
});

const getLikesByItem = asyncHandler(async (req, res) => {
    const { itemId, itemType } = req.params;

    if (!["Post", "Comment"].includes(itemType)) {
        throw new ApiError(400, "itemType must be Post or Comment");
    }

    const likes = await Like.find({ likedItem: itemId, itemType }).populate("user", "username email avatar");

    return res.status(200).json(new ApiResponse(200, likes, "Likes retrieved successfully"));
});

export { likeItem, unlikeItem, getLikesByItem };
