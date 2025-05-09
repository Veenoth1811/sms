import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifiedToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string); 
        (req as any).user = decoded; 
        next(); 
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
        console.error(error);
    }
};