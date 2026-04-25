import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.mongoURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongo;
