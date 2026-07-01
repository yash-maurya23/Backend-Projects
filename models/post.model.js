import mongoose from 'mongoose'

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true
    },
    content:{
        type:String,
        required:[true,'Enter your content here']
    },
     coverImage: {
        type: String, 
        default: ""
    },
    isPublished: {
        type: Boolean,
        default: false 
    },
     author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this ID to the User model
        required: true
    }
}, { timestamps: true });

const Post=mongoose.model('Post',postSchema);

export default Post;