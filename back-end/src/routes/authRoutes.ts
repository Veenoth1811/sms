import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserAuth from "../models/UserAuth";


const router = express.Router();

// SIGNUP

router.post("/signup", async (req, res) => {
  console.log("9")
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserAuth.findOne({ email });
  console.log(req.body)

    if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAuth({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
});

// SIGNIN
router.post("/signin", async (req, res) => {
  console.log("33");
  try {
    console.log("35");
    const { email, password } = req.body;
    const user = await UserAuth.findOne({ email });

    if (!user) {
        res.status(400).json({ message: "User not found" });
      return ;
    }
console.log("41");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    console.log("47");
    
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    
    
    res.json({ success: true, message: "Login successful",token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
    console.error(error);
  }
});

export default router;
