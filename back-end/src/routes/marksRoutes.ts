import express from "express";
import Results from "../models/Results"; // Assuming you have a Results model
import UserDetails from "../models/UserDetails"; // Assuming you have a UserDetails model

const router = express.Router();

// ADD OR UPDATE MARKS
router.post("/", async (req, res) => {
  try {
    const { selectedStudent, Tamil, English, Maths, Science, Social } = req.body;

    const user = await UserDetails.findById(selectedStudent);
    if (!user) {
     res.status(400).json({ message: "User not found" });
     return ;
    }

    // Calculate total and grade
    const total = Tamil + English + Maths + Science + Social;
    const grade =
      total >= 450
        ? "A+"
        : total >= 400
        ? "A"
        : total >= 350
        ? "B+"
        : total >= 300
        ? "B"
        : total >= 250
        ? "C"
        : "-";
    const status = total >= 250 ? "Pass" : "Fail";

    // Check if marks already exist for the student
    let marks = await Results.findOne({ register: user.register });

    if (marks) {
      // Update existing marks
      marks.marks = { Tamil, English, Maths, Science, Social };
      marks.total = total;
      marks.grade = grade;
      marks.status = status;
    } else {
      // Create new marks
      marks = new Results({
        name: user.name,
        register: user.register,
        marks: { Tamil, English, Maths, Science, Social },
        total,
        grade,
        status,
      });
    }

    await marks.save();
    res.json({ message: "Marks saved successfully", marks });
  } catch (error) {
    res.status(500).json({ message: "Error saving marks", error: (error as Error).message });
  }
});

// GET ALL STUDENT MARKS
router.get("/getMarks", async (_req, res) => {
  try {
    const students = await Results.find({}, { name: 1, register: 1, marks: 1, total: 1, grade: 1, status: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving marks", error: (error as Error).message });
  }
});

// GET INDIVIDUAL STUDENT MARKS
router.get("/getMarks/:id", async (req, res) => {
  try {
   
    const { id } = req.params;
    console.log({id});
    const student = await Results.findById(id);
console.log("79",student);
    if (!student) {
      res.status(400).json({ message: "Student not found" });
      return;
    }

    const marks = await Results.findOne({ register: student.register });
    res.json(marks || { message: "No marks found for this student" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching marks", error: (error as Error).message });
  }
});

// DELETE STUDENT MARKS
router.delete("/deleteMarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await UserDetails.findById(id);

    if (!student) {
      res.status(400).json({ message: "Student not found" });
      return ;
    }

    const deletedMarks = await Results.findOneAndDelete({ register: student.register });
    if (!deletedMarks) {
      res.status(400).json({ message: "Marks not found" });
      return ;
    }

    res.json({ message: "Marks deleted successfully", deletedMarks });
  } catch (error) {
    res.status(500).json({ message: "Error deleting marks", error: (error as Error).message });
  }
});

export default router;