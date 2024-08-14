import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AppRouter } from "./routes";

// Initialize Express
const app: Application = express();

// Middleware setup
app.use(bodyParser.json());

// Use CORS for development
app.use(cors());

// Routes
app.use("/v1", AppRouter);

export default app;
