import { Request, Response } from "express";

import express from "express";
const router = express.Router();
import Attendance from "../models/Attendance"; // Import your Mongoose Model

// Route to update attendance for multiple students
router.post("/markAttendance", async (req:Request, res:Response) => {
    try {
        const attendanceData = req.body; // Expecting an array of student records

        if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
          res.status(400).json({ message: "Invalid data format." });
            return;
        }

        // Update each student's attendance in the database
        for (let student of attendanceData) {
            await Attendance.findOneAndUpdate(
                { register: student.register }, // Match by register number
                { $set: { status: student.status } }, // Update attendance status
                { upsert: true, new: true } // Create if not exists
            );
        }

        res.status(200).json({ message: "Attendance updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating attendance" });
    }
});

export default router;
