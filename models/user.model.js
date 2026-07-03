import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


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

    //in order to encyrpt and check user
 userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

//password check
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}





    const User=mongoose.model('User',userSchema);
    export default User;