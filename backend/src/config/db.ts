import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/jobboard";
  console.log(`Attempting to connect to MongoDB at ${uri.split('@').pop()}...`); // Log URI (hidden credentials)
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Fail fast after 5 seconds
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
