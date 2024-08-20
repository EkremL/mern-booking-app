import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { log } from "console";
import mongoose from "mongoose";
import userRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const port = 5000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
// app.get("/api/test", async (req: Request, res: Response) => {
//   res.json({ message: "testing api endpoint, hello!" });
// });

app.listen(port, () => {
  log(`listening on port ${port}`);
  connectToDatabase();
});
