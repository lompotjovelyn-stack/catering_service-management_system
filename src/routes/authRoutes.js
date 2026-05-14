const express = require("express");
const { query } = require("../config/database");
const { requireAuth } = require("../middleware/auth");
const sessions = require("../middleware/sessions");
const { hashPassword } = require("../utils/password");
const { createToken } = require("../utils/token");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const users = await query(
      `SELECT u.id, u.username, u.password_hash, u.role, u.customer_id, c.full_name
       FROM users u
       LEFT JOIN customers c ON c.id = u.customer_id
       WHERE u.username = ?`,
      [username]
    );

    const user = users[0];
    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = createToken();
    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      customer_id: user.customer_id,
      full_name: user.full_name,
    };

    sessions.set(token, safeUser);
    res.json({ token, user: safeUser });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, (req, res) => {
  sessions.delete(req.token);
  res.json({ message: "Logged out." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
