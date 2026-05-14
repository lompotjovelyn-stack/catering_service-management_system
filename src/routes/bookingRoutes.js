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

router.post("/bookings", requireAuth, async (req, res, next) => {
  try {
    const { package_id, event_type, event_date, event_time, venue, guests, notes } = req.body;
    const customer_id = req.user.role === "customer" ? req.user.customer_id : req.body.customer_id;
    const status = req.user.role === "customer" ? "Pending" : req.body.status || "Pending";

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required." });
    }

    await query(
      `INSERT INTO bookings (customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, package_id, event_type, event_date, event_time, venue, guests, status, notes || null]
    );
    res.status(201).json({ message: "Booking added." });
  } catch (error) {
    next(error);
  }
});

router.put("/bookings/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await query("SELECT customer_id, status FROM bookings WHERE id = ?", [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const booking = existing[0];
    if (req.user.role === "customer") {
      if (booking.customer_id !== req.user.customer_id) {
        return res.status(403).json({ message: "You can only edit your own bookings." });
      }
    }

    const { package_id, event_type, event_date, event_time, venue, guests, notes } = req.body;
    const customer_id = req.user.role === "customer" ? booking.customer_id : req.body.customer_id;
    const status = req.user.role === "customer" ? booking.status : req.body.status || booking.status;

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

router.delete("/bookings/:id", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role === "customer") {
      const existing = await query("SELECT customer_id FROM bookings WHERE id = ?", [req.params.id]);
      if (!existing.length || existing[0].customer_id !== req.user.customer_id) {
        return res.status(403).json({ message: "You can only delete your own bookings." });
      }
    }

    await query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    res.json({ message: "Booking deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
