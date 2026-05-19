import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, me } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Configure Rate Limiting for Auth Routes (Prevents Brute-Force)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs for auth endpoints
  message: {
    error:
      "Muitas tentativas de login/cadastro. Tente novamente em 15 minutos.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// --- PUBLIC ROUTES ---

// Protected by rate limiter to avoid automated spam accounts
router.post("/register", authRateLimiter, register);

// Protected by rate limiter to avoid password cracking attempts
router.post("/login", authRateLimiter, login);

// --- PROTECTED ROUTES ---

// Requires validation middleware to check JWT presence/validity
router.get("/me", authMiddleware, me);

// Requires validation middleware so unauthenticated users can't spam cookie clearing
router.post("/logout", authMiddleware, logout);

export default router;
