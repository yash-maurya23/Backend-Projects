import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is needed'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
   password: {
    type: String,
    required: true,
    select: false
},
    avatar: {
        type: String,
        default: ""   // Optional default value if no avatar is provided
    },
    coverImage:{
        type:String,
    },
    refreshToken: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    });

//in order to encyrpt and check user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

//password check
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//jwt method for providint the bearer token,jiske paas hai token usko access milegi
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username

    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
userSchema.methods.generateRefreshToken = function () { 
     return jwt.sign({
        _id: this._id,
        },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}



const User = mongoose.model('User', userSchema);
export default User;