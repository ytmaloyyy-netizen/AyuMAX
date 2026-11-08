import express from "express";
import pg from "pg";
import crypto from "node:crypto";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

app.get("/", (req, res) => {
  res.json({
    name: "AyuMAX Cloud",
    version: "1.0.0",
    status: "running"
  });
});

app.get("/health", async (req, res) => {
  try {
    if (!pool) {
      return res.json({
        status: "ok",
        database: "not_configured"
      });
    }

    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected"
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.get("/api/info", (req, res) => {
  res.json({
    application: "AyuMAX",
    api: "1.0.0",
    features: [
      "accounts",
      "profiles",
      "chats",
      "groups",
      "channels"
    ],
    development: true
  });
});

app.listen(PORT, () => {
  console.log(`AyuMAX Cloud started on port ${PORT}`);
});
