import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const payload = { id: userId };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // CONFIGURAÇÃO DO COOKIE
  res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,        // OBRIGATÓRIO: Já que o backend está no Render (HTTPS)
  sameSite: "none",    // OBRIGATÓRIO: Permite enviar de um site (Render) para outro (Localhost)
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

  return token;
};
