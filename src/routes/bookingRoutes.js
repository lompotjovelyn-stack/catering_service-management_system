const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { bookingCustomerFilter } = require("../utils/customerFilter");

const router = express.Router();

router.get("/bookings", requireAuth, async (req, res, next) => {
  try {
    const filter = bookingCustomerFilter(req.user, "b");
    const rows = await query(
      `SELECT b.*, c.full_name, m.package_name, m.price
       FROM bookings b
       JOIN customers c ON c.id = b.customer_id
       JOIN menu_packages m ON m.id = b.package_id
       ${filter.sql}
       ORDER BY b.event_date DESC, b.event_time DESC`,
      filter.params
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/bookings", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes } = req.body;
    await query(
      `INSERT INTO bookings (customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, package_id, event_type, event_date, event_time, venue, guests, status || "Pending", notes || null]
    );
    res.status(201).json({ message: "Booking added." });
  } catch (error) {
    next(error);
  }
});

router.put("/bookings/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes } = req.body;
    await query(
      `UPDATE bookings
       SET customer_id = ?, package_id = ?, event_type = ?, event_date = ?, event_time = ?, venue = ?, guests = ?, status = ?, notes = ?
       WHERE id = ?`,
      [customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes || null, req.params.id]
    );
    res.json({ message: "Booking updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/bookings/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    await query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    res.json({ message: "Booking deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
