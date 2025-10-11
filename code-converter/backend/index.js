// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import codeConverterRouter from "./routes/code-converter.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Parse JSON request body
app.use("/api/code-converter", codeConverterRouter);
// Routes
app.use("/api/code-converter", codeConverterRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.get("/test", (req, res) => {
  res.json({ message: "Backend is alive!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
