import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    username:{
        type:String,
       required:[true,'Username is needed'],
       unique:true,
       trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar: {
        type: String, 
        default: ""   // Optional default value if no avatar is provided
    },
    refreshToken: {
        type: String, 
        default: null
 } },
    {
        timestamps:true
    });


    const User=mongoose.model('User',userSchema);
    export default User;