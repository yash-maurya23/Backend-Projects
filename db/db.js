
import mongoose from 'mongoose'


const connectDB=async()=>{
    try{
        const connected=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MONGODB is connected successfully: ${connected.connection.host}`);

    }
    catch(error){
        console.error(`Database connection error:${error.message}`);
    }
};


export default connectDB;