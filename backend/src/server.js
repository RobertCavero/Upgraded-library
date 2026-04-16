import "dotenv/config";
import cors from "cors";

import express from "express";

import { connectDB, disconnectDB } from "./config/db.js";

import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import booklistRoutes from "./routes/booklistRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);
app.use("/booklist", booklistRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
      console.log(`Server running on PORT ${process.env.PORT || 5001}`);
    });

    setupGracefulShutdown(server);
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};

startServer();

const setupGracefulShutdown = (server) => {
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  });

  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    try {
      await disconnectDB();
    } catch (dbErr) {
      console.error("Error during DB disconnect:", dbErr);
    } finally {
      process.exit(1);
    }
  });

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down",
      );
      process.exit(1);
    }, 10000);
    server.close(async () => {
      await disconnectDB();
      console.log("Closed out remaining connections");
      process.exit(0);
    });
  });
};
