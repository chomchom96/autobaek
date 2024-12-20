import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import problemRouter from "./routes/problem";

dotenv.config();

interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

const app: Express = express();

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Body parser middleware
app.use(express.json());

// Routes
app.use(userRouter);
app.use(problemRouter);

// Error handling middleware
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({ message: message, data: data });
  }
);

// Database connection and server start
const mongodbURI = process.env.MONGODB_URI;

if (!mongodbURI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

mongoose
  .connect(mongodbURI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => console.log(err));

process.on("unhandledRejection", (reason: any) => {
  console.log("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception:", error);
});
