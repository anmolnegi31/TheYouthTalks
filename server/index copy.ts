import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "/backend/src/config/database.js";

// Import routes
import userRoutes from "../backend/src/routes/user.js";
import formRoutes from "../backend/src/routes/surveyForm.js";
import responseRoutes from "../backend/src/routes/surveyResponse.js";
import categoryRoutes from "../backend/src/routes/category.js";
import { handleDemo } from "./routes/demo.js";
 
dotenv.config();

// Global state for database connection
import type { Request } from "express";

declare global {
  var mongoConnected: boolean;
  var databaseAvailable: boolean;

  namespace Express {
    interface Request {
      databaseAvailable?: boolean;
    }
  }
}

export function createServer() {
  const app = express();

  // Connect to MongoDB (only if not already attempted)
  const connectToDatabase = async () => {
    try {
      if (global.mongoConnected === undefined) {
        const connection = await connectDB();
        global.mongoConnected = !!connection;
        global.databaseAvailable = !!connection;

        if (!connection) {
          console.log("🔧 Running in demo mode - using in-memory data");
        }
      }
    } catch (error) {
      console.error("Database connection error:", error);
      global.mongoConnected = false;
      global.databaseAvailable = false;
    }
  };

  connectToDatabase();

  // Middleware
  app.use(
    cors({
      origin: ["http://localhost:8080", "http://localhost:3000"],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    }
    next();
  });

  // Database status middleware
  app.use("/api/", (req, res, next) => {
    req.databaseAvailable = global.databaseAvailable || false;
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Youth Talks API is running",
      timestamp: new Date().toISOString(),
      database: global.databaseAvailable ? "Connected" : "Demo Mode",
      mongoConnected: global.mongoConnected || false,
    });
  });

  // Legacy ping endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Hello from Express server v2!",
      database: global.databaseAvailable ? "Connected" : "Demo Mode",
    });
  });

  // Demo endpoint
  app.get("/api/demo", handleDemo);

  // API status endpoint
  app.get("/api/status", (req, res) => {
    res.json({
      success: true,
      status: "operational",
      database: global.databaseAvailable ? "connected" : "demo-mode",
      features: {
        forms: true,
        responses: true,
        users: global.databaseAvailable,
        persistence: global.databaseAvailable,
      },
      message: global.databaseAvailable
        ? "All systems operational"
        : "Running in demo mode - check MONGODB_SETUP.md for database setup",
    });
  });

  // Main API routes (with database check)
  if (global.databaseAvailable !== false) {
    app.use("/api/users", userRoutes);
    app.use("/api/forms", formRoutes);
    app.use("/api/responses", responseRoutes);
    app.use("/api/categories", categoryRoutes);
  } else {
    // Demo endpoints when database is not available
    app.use("/api/users", (req, res) => {
      res.status(503).json({
        success: false,
        message: "Database not available - running in demo mode",
        setup: "Check MONGODB_SETUP.md for database setup instructions",
      });
    });

    app.use("/api/forms", (req, res) => {
      res.status(503).json({
        success: false,
        message: "Database not available - using frontend mock data",
        setup: "Check MONGODB_SETUP.md for database setup instructions",
      });
    });

    app.use("/api/responses", (req, res) => {
      res.status(503).json({
        success: false,
        message: "Database not available - responses not persisted",
        setup: "Check MONGODB_SETUP.md for database setup instructions",
      });
    });

    app.use("/api/categories", (req, res) => {
      res.status(503).json({
        success: false,
        message: "Database not available - using frontend mock data",
        setup: "Check MONGODB_SETUP.md for database setup instructions",
      });
    });
  }

  // Error handling
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("API Error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(err.errors).map((e: any) => e.message),
      });
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  });

  return app;
}
