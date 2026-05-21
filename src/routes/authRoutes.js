const express = require("express");
const { getPool, query } = require("../config/database");
const { requireAuth } = require("../middleware/auth");
const sessions = require("../middleware/sessions");
const { hashPassword } = require("../utils/password");
const { createToken } = require("../utils/token");

const router = express.Router();

function safeUserFromRow(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    customer_id: user.customer_id,
    full_name: user.full_name,
  };
}

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
    const safeUser = safeUserFromRow(user);

    sessions.set(token, safeUser);
    res.json({ token, user: safeUser });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const { full_name, email, phone, address, username, password } = req.body;
    if (!full_name || !email || !phone || !address || !username || !password) {
      return res.status(400).json({ message: "Complete all registration fields." });
    }

    await connection.beginTransaction();

    const [customerResult] = await connection.execute(
      "INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)",
      [full_name, email, phone, address]
    );

    const customerId = customerResult.insertId;
    const [userResult] = await connection.execute(
      "INSERT INTO users (username, password_hash, role, customer_id) VALUES (?, ?, 'customer', ?)",
      [username, hashPassword(password), customerId]
    );

    await connection.commit();

    const safeUser = {
      id: userResult.insertId,
      username,
      role: "customer",
      customer_id: customerId,
      full_name,
    };
    const token = createToken();
    sessions.set(token, safeUser);

    res.status(201).json({ token, user: safeUser, message: "Customer account registered." });
  } catch (error) {
    await connection.rollback().catch(() => {});
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username or email already exists." });
    }
    next(error);
  } finally {
    connection.release();
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
