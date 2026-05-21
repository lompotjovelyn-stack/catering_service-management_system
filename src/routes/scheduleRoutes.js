const express = require("express");
const { query } = require("../config/database");
const { requireAuth } = require("../middleware/auth");
const { bookingCustomerFilter } = require("../utils/customerFilter");

const router = express.Router();

router.get("/schedules", requireAuth, async (req, res, next) => {
  try {
    const filter = bookingCustomerFilter(req.user, "b");
    const rows = await query(
      `SELECT b.id, b.event_type, b.event_date, b.event_time, b.venue, b.guests, b.status, c.full_name, m.package_name
       FROM bookings b
       JOIN customers c ON c.id = b.customer_id
       JOIN menu_packages m ON m.id = b.package_id
       ${filter.sql}
       ORDER BY b.event_date ASC, b.event_time ASC`,
      filter.params
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
