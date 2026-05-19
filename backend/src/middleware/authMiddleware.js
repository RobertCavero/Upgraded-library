import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {

  console.log("Cookies recebidos:", req.cookies);
  console.log("Header Authorization:", req.headers.authorization);
  let token;

  // 1. Check Authorization Header or HttpOnly Cookies
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // If no token is found, stop execution immediately
  if (!token) {
    return res
      .status(401)
      .json({ error: "Não autorizado, token não fornecido." });
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch User (Excluding the sensitive password field)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        // Add other safe fields your application needs here, but omit 'password'
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    // Attach the safe user object to the request lifecycle
    req.user = user;
    return next();
  } catch (error) {
    console.error("Erro na verificação do token:", error.message);

    // OPTIONAL UX BOOST: If the cookie token is invalid/expired, clear it automatically
    if (req.cookies?.jwt) {
      res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
      });
    }

    return res
      .status(401)
      .json({ error: "Não autorizado, token inválido ou expirado." });
  }
};
