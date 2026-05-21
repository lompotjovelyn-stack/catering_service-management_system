const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { bookingCustomerFilter } = require("../utils/customerFilter");

const router = express.Router();

function isPastEventDate(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(eventDate.getTime()) || eventDate < today;
}

function selectedIds(value) {
  if (Array.isArray(value)) return value.map(Number).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(Boolean);
}

async function validatePerHeadSelection(ids) {
  if (!ids.length) {
    return { valid: false, message: "Select food items for per head booking." };
  }

  const placeholders = ids.map(() => "?").join(",");
  const rows = await query(`SELECT id, category FROM food_items WHERE id IN (${placeholders})`, ids);
  if (rows.length !== ids.length) {
    return { valid: false, message: "One or more selected foods are invalid." };
  }

  const counts = rows.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + 1;
    return totals;
  }, {});

  if (counts["Main Dish"] !== 3 || counts.Rice !== 1 || counts.Dessert !== 1 || counts.Drinks !== 1) {
    return { valid: false, message: "Per head menu requires 3 main dishes, 1 rice, 1 dessert, and 1 drink." };
  }

  return { valid: true };
}

router.get("/bookings", requireAuth, async (req, res, next) => {
  try {
    const filter = bookingCustomerFilter(req.user, "b");
    const rows = await query(
      `SELECT b.*, c.full_name, m.package_name, m.price,
              (
                SELECT GROUP_CONCAT(fi.food_name ORDER BY FIELD(fi.category, 'Main Dish', 'Rice', 'Dessert', 'Drinks'), fi.food_name SEPARATOR ', ')
                FROM food_items fi
                WHERE FIND_IN_SET(fi.id, b.selected_food_items)
              ) AS selected_food_names
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
    const { package_id, order_type, selected_food_items, event_type, event_date, event_time, venue, guests, notes } = req.body;
    const customer_id = req.user.role === "customer" ? req.user.customer_id : req.body.customer_id;
    const status = req.user.role === "admin" ? req.body.status || "Pending" : "Pending";
    const type = order_type === "Per Head" ? "Per Head" : "Package";
    const foodIds = selectedIds(selected_food_items);

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required." });
    }

    if (isPastEventDate(event_date)) {
      return res.status(400).json({ message: "Choose today or a future event date." });
    }

    if (type === "Per Head") {
      const validation = await validatePerHeadSelection(foodIds);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
    }

    await query(
      `INSERT INTO bookings (customer_id, package_id, order_type, selected_food_items, per_head_price, event_type, event_date, event_time, venue, guests, status, notes)
       VALUES (?, ?, ?, ?, 250, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, package_id, type, type === "Per Head" ? foodIds.join(",") : null, event_type, event_date, event_time, venue, guests, status, notes || null]
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

    const { package_id, order_type, selected_food_items, event_type, event_date, event_time, venue, guests, notes } = req.body;
    const customer_id = req.user.role === "customer" ? booking.customer_id : req.body.customer_id;
    const status = req.user.role === "admin" ? req.body.status || booking.status : booking.status;
    const type = order_type === "Per Head" ? "Per Head" : "Package";
    const foodIds = selectedIds(selected_food_items);

    if (isPastEventDate(event_date)) {
      return res.status(400).json({ message: "Choose today or a future event date." });
    }

    if (type === "Per Head") {
      const validation = await validatePerHeadSelection(foodIds);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
    }

    await query(
      `UPDATE bookings
       SET customer_id = ?, package_id = ?, order_type = ?, selected_food_items = ?, per_head_price = 250,
           event_type = ?, event_date = ?, event_time = ?, venue = ?, guests = ?, status = ?, notes = ?
       WHERE id = ?`,
      [customer_id, package_id, type, type === "Per Head" ? foodIds.join(",") : null, event_type, event_date, event_time, venue, guests, status, notes || null, req.params.id]
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
