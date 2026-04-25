import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
const log = console.log;
const mongoURL = process.env.mongoURL;
if (!mongoURL) {
  console.error(
    chalk.red("Error: mongoURL not defined in environment variables"),
  );
  process.exit(1); // return a 1, clears mem, and exit process entirely
}
const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
    log(chalk.green("#Connected to MongoDB"));
  } catch (error) {
    log(chalk.red("Error connecting to MongoDB:", error));
    process.exit(1);
  }
};

export default connectMongo;
