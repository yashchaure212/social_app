import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDb from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config({});

const app = express();

//cors config
const corsOption = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

//Routes
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);


app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running",
    success: true,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
