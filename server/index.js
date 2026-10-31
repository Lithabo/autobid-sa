
console.log("AUTOBID SERVER FILE IS EXECUTING");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        /^http:\/\/localhost:517[3-9]$/.test(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error("Origin not allowed"));
    },
  })
);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("Set a strong JWT_SECRET in your .env file");
}

// Temporary development-only storage.
// Accounts disappear when the server restarts.
const users = [];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

function createToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Please sign in" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find((item) => item.id === payload.sub);

    if (!user) {
      return res.status(401).json({ error: "Account not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "AutoBid SA" });
});

app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      name.trim().length < 2 ||
      name.length > 100 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 12 ||
      password.length > 128
    ) {
      return res.status(400).json({
        error: "Enter a valid name, email and password of at least 12 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "customer",
      membershipStatus: "inactive",
    };

    users.push(user);

    res.status(201).json({
      message: "Account created successfully",
      token: createToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipStatus: user.membershipStatus,
      },
    });
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid login details" });
  }

  const user = users.find(
    (item) => item.email === email.trim().toLowerCase()
  );

  const valid = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
    },
  });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  const { id, name, email, role, membershipStatus } = req.user;

  res.json({ id, name, email, role, membershipStatus });
});

app.listen(PORT, () => {
  console.log(`AutoBid SA backend running at http://localhost:${PORT}`);
});
