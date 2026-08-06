import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The ID of the item being liked (can be a Post ID or a Comment ID)
    likedItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType' // This tells Mongoose to look at the 'itemType' field below
    },
    // Dictates whether the likedItem is a Post or a Comment
    itemType: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'] // Restricts values to only these two options
    }
}, { timestamps: true });

// Prevent a user from liking the exact same post or comment more than once
likeSchema.index({ user: 1, likedItem: 1, itemType: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;