import express from "express";
import { removeFavorite, toggleFavorite, getFavorites } from "../controllers/favoritesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/",  getFavorites);
router.post("/:bookId", toggleFavorite);
router.delete("/:bookId", removeFavorite);

export default router;