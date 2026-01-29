import express from "express";
import "dotenv/config";
import mongoose from "./db/db.js";
import mainRoute from "./routes/main.route.js";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;

// Database connection
const db = mongoose.connection;

db.on("error", (error) => {
  console.log("❌ DB Error", error);
});

db.once("open", () => {
  console.log("✅ DB Connected");
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "http://localhost:5173" || [],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

// Important: Preflight requests handle karne ke liye
app.options('*', cors());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthcare API is running",
    timestamp: new Date().toISOString(),
    routes: {
      api: "/api",
    },
  });
});

// API Routes
app.use("/api", mainRoute);

// 404 Handler - Fixed (no wildcard)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler (must have 4 parameters: err, req, res, next)
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err);
  res.status(500).json({
    success: false,
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// EXPORT for Vercel
export default app;

// Only for local development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}
