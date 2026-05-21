const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { hashPassword } = require("../utils/password");

const router = express.Router();

router.get("/users", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT u.id, u.username, u.role, u.customer_id, c.full_name, u.created_at
       FROM users u
       LEFT JOIN customers c ON c.id = u.customer_id
       ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/users", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { username, password, role, customer_id } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Username, password, and role are required." });
    }

    if (!["admin", "staff", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    await query("INSERT INTO users (username, password_hash, role, customer_id) VALUES (?, ?, ?, ?)", [
      username,
      hashPassword(password),
      role,
      role === "customer" ? customer_id || null : null,
    ]);
    res.status(201).json({ message: "Account added." });
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { username, password, role, customer_id } = req.body;
    if (!username || !role) {
      return res.status(400).json({ message: "Username and role are required." });
    }

    if (!["admin", "staff", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const passwordSql = password ? ", password_hash = ?" : "";
    const params = [username, role, role === "customer" ? customer_id || null : null];
    if (password) params.push(hashPassword(password));
    params.push(req.params.id);

    await query(
      `UPDATE users SET username = ?, role = ?, customer_id = ?${passwordSql} WHERE id = ?`,
      params
    );
    res.json({ message: "Account updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (Number(req.params.id) === Number(req.user.id)) {
      return res.status(400).json({ message: "You cannot delete your own account while logged in." });
    }

    await query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "Account deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
