import express from "express";
import "dotenv/config";
import mongoose from "./db/db.js";
import mainRoute from "./routes/main.route.js";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;
const FrontEnd_Url = process.env.FRONTEND_URL;

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

const normalizeOrigin = (value) => value.trim().replace(/\/+$/, "");

const allowedOrigins = FrontEnd_Url
  ? FrontEnd_Url.split(",").map(normalizeOrigin).filter(Boolean)
  : [];

const isOriginAllowed = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.some((allowed) => {
    // Exact match (e.g. https://myapp.vercel.app)
    if (!allowed.includes("*")) {
      return normalizedOrigin === allowed;
    }

    // Wildcard suffix match (e.g. https://*.vercel.app)
    const wildcardPrefix = "https://*.";
    if (allowed.startsWith(wildcardPrefix)) {
      const domainSuffix = allowed.slice(wildcardPrefix.length);
      return (
        normalizedOrigin.startsWith("https://") &&
        normalizedOrigin.slice("https://".length).endsWith(`.${domainSuffix}`)
      );
    }

    return false;
  });
};

const corsOptions = {
  origin: function (origin, callback) {
    // allow Postman / server-side requests
    if (!origin) return callback(null, true);

    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
