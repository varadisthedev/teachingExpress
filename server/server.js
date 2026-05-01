import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectMongo from "./connectmongo.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";
import chalk from "chalk";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const log = console.log;
import rateLimit from "express-rate-limit";
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
// in ms: 15 minutes, max 5 requests per IP

// Connect to MongoDB
connectMongo();

// middlware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/users", limiter);

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Express API");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server Error" });
});
app.listen(PORT, () => {
  log(chalk.blue(`##Server is running on: http://localhost:${PORT}/`));
});
