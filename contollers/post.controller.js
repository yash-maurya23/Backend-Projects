import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";

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

    ///suppose frontend sends posts?search=node&page=2&limit=5 then search = "node",page=2,limit=5


    const {
        search,
        author,
        isPublished,
        startDate,
        endDate,
        sort,
        page = 1,
        limit = 10
    } = req.query;

    const query = {};//empty means find  everything

    if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [    //it means if search=node so here this means find title contain node and content contain node

            { title: regex },
            { content: regex }
        ];
    }

    if (author) {
        query.author = author;
    }

    if (typeof isPublished !== "undefined") {
        query.isPublished = isPublished === "true";
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate); //>= <== mongo understand this thorugh gte and lte,could mean start and end date


        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sortOptions = {};
    if (sort) {
        const fields = sort.split(",");
        for (const field of fields) {
            const direction = field.startsWith("-") ? -1 : 1;
            const key = field.replace(/^[-+]/, "");
            sortOptions[key] = direction;
        }
    } else {
        sortOptions.createdAt = -1;
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * pageSize;

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .populate("author", "username email avatar")
        .lean();

    const postIds = posts.map(post => post._id);
    const likeCounts = await Like.aggregate([
        { $match: { itemType: "Post", likedItem: { $in: postIds } } },
        { $group: { _id: "$likedItem", count: { $sum: 1 } } }
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
    }, {});

    const results = posts.map(post => ({
        ...post,
        likeCount: likeCountMap[post._id.toString()] || 0
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                meta: {
                    page: pageNumber,
                    limit: pageSize,
                    totalPosts,
                    totalPages: Math.ceil(totalPosts / pageSize)
                },
                data: results
            },
            "All blog posts fetched successfully"
        )
    );
});

// ================= GET POST BY ID =================
const getPostById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id)
        .populate("author", "username email avatar")
        .lean();

    if (!post) {
        throw new ApiError(404, "Blog post not found");
    }

    const likeCountResult = await Like.countDocuments({ itemType: "Post", likedItem: id });
    post.likeCount = likeCountResult;

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