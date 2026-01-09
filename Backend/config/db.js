import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://username:password@cluster0.zafxk.mongodb.net/database').then(()=>console.log("DB Connected"));

}
