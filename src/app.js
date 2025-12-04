import express from "express";
import authRoutes from "./routes/authR.js";
import booksRoutes from "./routes/booksR.js";
import userRoutes from "./routes/userR.js";
import borrowRoutes from "./routes/borrowerR.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrow", borrowRoutes);

export default app;