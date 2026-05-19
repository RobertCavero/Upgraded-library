import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/adminMiddleware.js";

const router = express.Router()

router.get("/dashboard", authMiddleware, requireRole("ADMIN"), (req, res)=>{
    res.json({message: "Admin dashboard data"})
})

router.get("/users", authMiddleware, requireRole("ADMIN"), (req, res)=>{
    res.json({message: "List of users (admin only)"})
})

export default router;