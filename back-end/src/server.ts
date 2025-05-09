
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifiedToken } from "./middleware/auth";



// Import Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import marksRoutes from "./routes/marksRoutes";
import { METHODS } from "http";

// Initialize Express App
const app: Application = express();
const PORT = 3000;
dotenv.config();

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());


// Database Connection (Single DB)
mongoose.connect("mongodb://127.0.0.1:27017/collegeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any);

mongoose.connection.on("connected", () => console.log("Connected to collegeDB"));
mongoose.connection.on("error", (err) => console.error("DB connection error:", err));

// Routes
app.use("/auth",authRoutes);        // User Signup & Login
app.use("/users",verifiedToken, userRoutes);       // User Management
app.use("/attendance",verifiedToken, attendanceRoutes); // Attendance Management
app.use("/marks",verifiedToken, marksRoutes);      // Marks Management

// Default Route
app.get("/", (_req: Request, res: Response) => {
    res.send("Welcome to College Management API");
});



// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
