import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Helper function to handle standard internal errors without duplicating code
const handleServerError = (
  res,
  error,
  customMessage = "Internal server error",
) => {
  console.error(`${customMessage}:`, error);
  return res.status(500).json({ error: "Ocorreu um erro no servidor." });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Payload Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // 5. Generate authentication session/token
    const token = generateToken(user.id, res);

    return res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token, // Included if you are also writing tokens to local storage fallback
      },
    });
  } catch (error) {
    return handleServerError(res, error, "Erro no registro de usuário");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Timing/Security fallback: If user doesn't exist, run a dummy bcrypt compare
    // to prevent timing attacks that reveal if an email exists.
    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(
          "dummy_password",
          "$2a$10$dummyhashdummyhashdummyhash",
        );

    // Uniform 401 response regardless of which field was invalid
    if (!user || !validPassword) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    const token = generateToken(user.id, res);

    // CORREÇÃO: Alterado de 201 para 200 OK
    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    return handleServerError(res, error, "Erro no login de usuário");
  }
};

const logout = async (req, res) => {
  try {
    // Clear cookie parameters should match your initialization flags (Secure, SameSite, etc.)
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    return res.status(200).json({
      status: "success",
      message: "Deslogado com sucesso.",
    });
  } catch (error) {
    return handleServerError(res, error, "Erro no logout");
  }
};

const me = async (req, res) => {
  // If req.user is populated by your auth middleware, return it securely
  if (!req.user) {
    return res.status(401).json({ error: "Não autorizado." });
  }

  // Ensure you aren't returning the hashed password from the middleware mapping
  const { password, ...safeUserData } = req.user;

  return res.status(200).json({
    user: safeUserData,
  });
};

export { register, login, logout, me };
