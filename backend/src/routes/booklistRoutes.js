import express from "express";
import { addToBooklist, removeFromBooklist, updateBooklistItem } from "../controllers/booklistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToBooklistSchema } from "../validators/booklistValidators.js";


const router = express.Router();

router.use(authMiddleware); 

router.post("/", validateRequest(addToBooklistSchema), addToBooklist);

router.put("/:id", updateBooklistItem);


router.delete("/:id", removeFromBooklist);





export default router