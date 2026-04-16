const redis = require("./redis");

const RATE_LIMIT = 5;
const WINDOW = 60;

async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `rate:${ip}`;

    let current = await redis.get(key);
    current = current ? parseInt(current) : 0;

    if (current >= RATE_LIMIT) {
      return res.status(429).json({
        error: "Too many requests"
      });
    }

    if (current === 0) {
      await redis.set(key, 1, { EX: WINDOW });
    } else {
      await redis.incr(key);
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // important
  }
}

// ✅ VERY IMPORTANT LINE
module.exports = rateLimiter;