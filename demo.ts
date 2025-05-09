import express from "express";
import Results from "../models/Results";
import UserDetails from "../models/UserDetails";

const router = express.Router();

// ADD OR UPDATE MARKS
router.post("/", async (req, res) => {
  try {
   
    const { selectedStudent,Tamil, English, Maths, Science, Social, grade } = req.body;

    const user = await UserDetails.findById(selectedStudent);
if(!user){
  throw new Error("User not found");
  
}
    // Validate input
    if (
      Tamil === undefined ||
      English === undefined ||
      Maths === undefined ||
      Science === undefined ||
      Social === undefined
    ) {
      res.status(400).json({ message: "All subjects are required" });
      return;
    }

    // Calculate total
    const total = Tamil + English + Maths + Science + Social;

    // Determine status
    const status = total >= 250 ? "Pass" : "Fail";

    const createdUser = new Results(
      
      { name:user.name,register:user.register,marks: { Tamil, English, Maths, Science, Social }, total, grade, status },
    
    );

await createdUser.save();

  

    res.json({ message: "Marks created successfully", createdUser});
  } catch (error) {
    res.status(500).json({ message: "Error updating marks", error: (error as Error).message });
  }
});

// GET ALL STUDENT MARKS
router.get("/getMarks", async (_req, res) => {
  try {
    const students = await Results.find({}, { name: 1, register: 1, marks: 1, total: 1, grade: 1, status: 1 });
    console.log(students);
    
   
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving marks", error: (error as Error).message });
  }
});

// GET INDIVIDUAL STUDENT MARKS
router.post("/updateMarks/:id", async (req, res) => {
  try {
      const { id } = req.params;  // Extract student ID
      const marks = req.body;  // Get marks from request body
console.log(req.body);

      const updatedStudent = await marks.findByIdAndUpdate(
          id,
          { marks },
          { new: true }
      );

      if (!updatedStudent) {
        
        
        res.status(404).json({ message: "Student not found" });
        return ;
      }

      res.json({ message: "Marks updated successfully", updatedStudent });
  } catch (error) {
      res.status(500).json({ message: "Error updating marks", error });
  }
});

// DELETE STUDENT MARKS
router.delete("/deleteMarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Results.findByIdAndDelete(id);

    if (!deletedStudent) {
      res.status(404).json({ message: "Student not found" });
      return ;
    }

    res.json({ message: "Student marks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student marks", error });
  }
});

export default router;
