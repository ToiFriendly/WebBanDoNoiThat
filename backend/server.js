const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const homeRoutes = require("./routes/homeRoutes");
const shopRoutes = require("./routes/shopRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
const port = process.env.PORT || 5000;
app.set("trust proxy", 1);

function normalizeOrigin(value) {
  if (!value) {
    return "";
  }

  try {
    return new URL(String(value).trim()).origin;
  } catch {
    return "";
  }
}

const configuredAllowedOrigins = [
  process.env.CLIENT_URL,
  process.env.SERVER_PUBLIC_URL,
  process.env.FRONTEND_PUBLIC_URL,
  process.env.APP_PUBLIC_URL,
  ...(process.env.ALLOWED_ORIGINS || "").split(","),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
]
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = [...new Set(configuredAllowedOrigins)];

function resolveRequestOrigin(req) {
  const forwardedHost = req.get("x-forwarded-host");
  const forwardedProto = req.get("x-forwarded-proto");
  const host = forwardedHost || req.get("host");
  const protocol = forwardedProto || req.protocol;

  return host ? normalizeOrigin(`${protocol}://${host}`) : "";
}

function isAllowedOrigin(origin, req) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const requestOrigin = resolveRequestOrigin(req);

  return Boolean(
    normalizedOrigin &&
      (allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin === requestOrigin)
  );
}

app.use(requestLogger);
app.use(
  cors((req, callback) => {
    const origin = req.get("origin");
    const originAllowed = isAllowedOrigin(origin, req);

    callback(null, {
      origin: originAllowed,
      credentials: true
    });
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    message: "Backend auth is running.",
    allowedOrigins,
    database: dbStatus
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error."
  });
});

async function startServer() {
  // Start server first, then connect to MongoDB
  app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || undefined
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Server will continue running but database operations will fail");
  }
}

startServer();

module.exports = app;
