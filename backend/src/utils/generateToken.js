import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const payload = { id: userId };

  // 1. Get expiration configuration
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

  // Create a fallback calculation or read a dedicated COOKIE_MAX_AGE env variable
  // Default: 7 days in milliseconds
  const cookieMaxAge = process.env.COOKIE_MAX_AGE
    ? parseInt(process.env.COOKIE_MAX_AGE, 10)
    : 1000 * 60 * 60 * 24 * 7;

  // 2. Sign Token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: jwtExpiresIn,
  });

  // 3. Determine Environment Variables Dynamic Flags
  const isProduction = process.env.NODE_ENV === "production";

  // 4. Set Cookie Configuration Safely
  res.cookie("jwt", token, {
    httpOnly: true,
    // Automatically enforces secure cookies on production (Render HTTPS),
    // but adapts if you run local cross-development testing over plain HTTP.
    secure: isProduction ? true : process.env.FORCE_SECURE_COOKIES === "true",

    // "none" is required for cross-site cookie passing (Render to Vercel/Localhost).
    // Note: Chrome requires 'secure: true' if 'sameSite' is set to 'none'.
    sameSite: isProduction ? "none" : "lax",

    maxAge: cookieMaxAge,
    path: "/", // Ensures cookie accessibility across all backend endpoints
  });

  return token;
};
