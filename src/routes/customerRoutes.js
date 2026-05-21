const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { customerWhere } = require("../utils/customerFilter");

const router = express.Router();

router.get("/customers", requireAuth, async (req, res, next) => {
  try {
    const filter = customerWhere(req.user, "c");
    const rows = await query(
      `SELECT c.id, c.full_name, c.email, c.phone, c.address, c.created_at
       FROM customers c${filter.sql}
       ORDER BY c.created_at DESC`,
      filter.params
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/customers", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { full_name, email, phone, address } = req.body;
    await query("INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)", [
      full_name,
      email,
      phone,
      address,
    ]);
    res.status(201).json({ message: "Customer added." });
  } catch (error) {
    next(error);
  }
});

router.put("/customers/:id", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role === "customer" && Number(req.params.id) !== Number(req.user.customer_id)) {
      return res.status(403).json({ message: "You can only update your own profile." });
    }

    if (req.user.role !== "customer" && !["admin", "staff"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin and staff can edit customer records." });
    }

    const { full_name, email, phone, address } = req.body;
    await query("UPDATE customers SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?", [
      full_name,
      email,
      phone,
      address,
      req.params.id,
    ]);
    res.json({ message: "Customer updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/customers/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    await query("DELETE FROM customers WHERE id = ?", [req.params.id]);
    res.json({ message: "Customer deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
