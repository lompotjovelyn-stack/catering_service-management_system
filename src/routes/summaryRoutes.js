const express = require("express");
const { query } = require("../config/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/summary", requireAuth, async (req, res, next) => {
  try {
    const customerFilter = req.user.role === "customer" ? "WHERE customer_id = ?" : "";
    const params = req.user.role === "customer" ? [req.user.customer_id || 0] : [];

    const [customersCount, bookingsCount, paymentsTotal, upcoming] = await Promise.all([
      req.user.role === "customer"
        ? Promise.resolve([{ total: 1 }])
        : query("SELECT COUNT(*) AS total FROM customers"),
      query(`SELECT COUNT(*) AS total FROM bookings ${customerFilter}`, params),
      query(
        `SELECT COALESCE(SUM(p.amount), 0) AS total
         FROM payments p
         JOIN bookings b ON b.id = p.booking_id
         ${req.user.role === "customer" ? "WHERE b.customer_id = ?" : ""}`,
        params
      ),
      query(
        `SELECT b.id, b.event_type, b.event_date, b.event_time, b.venue, b.status, c.full_name
         FROM bookings b
         JOIN customers c ON c.id = b.customer_id
         ${req.user.role === "customer" ? "WHERE b.customer_id = ?" : ""}
         ORDER BY b.event_date ASC, b.event_time ASC
         LIMIT 5`,
        params
      ),
    ]);

    res.json({
      customers: customersCount[0].total,
      bookings: bookingsCount[0].total,
      revenue: Number(paymentsTotal[0].total),
      upcoming,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
