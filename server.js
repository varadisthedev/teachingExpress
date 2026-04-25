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

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Express API");
});
app.listen(PORT, () => {
  log(chalk.blue(`##Server is running on: http://localhost:${PORT}/`));
});
