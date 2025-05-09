import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/collegeDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

export default mongoose;
