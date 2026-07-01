import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content cannot be empty'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Self-referencing relationship for replies
        default: null   // Null means it is a main comment, not a reply
    }
}, { timestamps: true }); 

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;