import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const payload = { id: userId };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // CONFIGURAÇÃO DO COOKIE
  res.cookie("jwt", token, {
    httpOnly: true,
    // Se o seu backend já estiver no Render (HTTPS) e o front local, 'secure' PRECISA ser true e 'sameSite' PRECISA ser "none"
    // Se AMBOS (front e back) estiverem rodando localmente (HTTP), use as linhas comentadas abaixo:
    secure: true,
    sameSite: "none",

    /* Use esta configuração se estiver rodando TUDO (Back e Front) no seu PC:
    secure: false,
    sameSite: "lax",
    */

    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
  });

  return token;
};
