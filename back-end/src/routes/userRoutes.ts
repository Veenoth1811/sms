import express from "express";
import UserDetails from "../models/UserDetails";
import { log } from "console";

const router = express.Router();

// GET USERS
router.get("/getUsers", async (_req, res) => {
  try {
    
    const users = await UserDetails.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
    console.log(localStorage.getItem("token"));
  }
});

// ADD USER
router.post("/addUser", async (req, res) => {
  console.log("Incoming Request Body:", req.body);

 
  
  
  try {
    const { name, phone,email , register } = req.body;

    const existingName = await UserDetails.findOne({ name });
    const existingPhone = await UserDetails.findOne({ phone });
    const existingEmail = await UserDetails.findOne({ email });
    const existinRegister = await UserDetails.findOne({ register });
  
  

      const newUser = new UserDetails(req.body);
      await newUser.save();
      res.json(newUser);
  } catch (error) {
      console.error(" Error adding user:", error);
      console.log(error);
      res.status(500).json({ message: "Error adding user", error: (error as Error).message });
  }
});

// UPDATE USER
router.put("/updateUser/:id", async (req, res) => {
  try {
    const updatedUser = await UserDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
        res.status(400).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// DELETE USER
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deletedUser = await UserDetails.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        res.status(400).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
