const express = require("express");
const { nanoid } = require("nanoid");
require("./db");
const redis = require("./redis");
const Url = require("./model");
const instance = process.env.INSTANCE_NAME || "unknown";
const rateLimiter = require("./rateLimiter");
const app = express();
app.use(express.json());


// Create short URL
app.post("/api/shorten",rateLimiter, async (req, res) => {
  let { url, customCode, expiryMinutes } = req.body;

  // ✅ Ensure URL has protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  let shortCode;

  // 🔥 1. HANDLE CUSTOM CODE PROPERLY
  if (customCode && customCode.trim() !== "") {
    shortCode = customCode.trim();

    // ✅ Validate allowed characters
    const isValid = /^[a-zA-Z0-9_-]+$/.test(shortCode);
    if (!isValid) {
      return res.status(400).json({
        error: "Only letters, numbers, - and _ allowed"
      });
    }

    // ❌ Prevent reserved keywords
    if (shortCode === "shorten") {
      return res.status(400).json({
        error: "This keyword is reserved"
      });
    }

    // ❌ Check duplicate
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({
        error: "Custom URL already exists"
      });
    }

  } else {
    // 🔥 2. AUTO GENERATE CODE
    shortCode = nanoid(6);
  }

  // 🔥 3. EXPIRY LOGIC
  let expiresAt = null;
  if (expiryMinutes) {
    expiresAt = new Date(Date.now() + expiryMinutes * 60000);
  }

  // 🔥 4. SAVE
  await Url.create({
    shortCode,
    originalUrl: url,
    expiresAt,
  });

  // 🔥 5. RESPONSE
  res.json({
    shortUrl: `http://localhost:8080/${shortCode}`,
    server: instance
  });
});
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ _id: -1 }); // latest first
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});
// Redirect
app.get("/:code", async (req, res) => {
  const code = req.params.code;

  // 🔹 Check Redis
  const cached = await redis.get(code);
  if (cached) {
    console.log("CACHE HIT");
    return res.redirect(cached);
  }

  const data = await Url.findOne({ shortCode: code });

  if (!data) {
    return res.status(404).send("Not found");
  }

  // ✅ Expiry check
  if (data.expiresAt && new Date() > data.expiresAt) {
    return res.status(410).send("Link expired");
  }

  // 🔹 Save to cache
  await redis.set(code, data.originalUrl, { EX: 60 });

  console.log("CACHE MISS → DB");

  res.redirect(data.originalUrl);
});

app.listen(3000, () => console.log("Server running on 3000"));