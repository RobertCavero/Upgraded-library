import express from "express";
import getBooks from "../controllers/getBooksController.js";
const router = express.Router()



router.get("/", getBooks)

router.post("/", (req,res)=>{
    res.json({httpMethod:"post"});
})

router.put("/", (req,res)=>{
    res.json({httpMethod:"put"});
})

router.delete("/", (req,res)=>{
    res.json({httpMethod:"delete"});
})

export default router