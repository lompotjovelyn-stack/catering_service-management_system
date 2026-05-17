const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireEditor } = require("../middleware/auth");
const { bookingCustomerFilter } = require("../utils/customerFilter");
const { generatePaymentQRCode } = require("../utils/qrcode");

const router = express.Router();

router.get("/payments", requireAuth, async (req, res, next) => {
  try {
    const filter = bookingCustomerFilter(req.user, "b");
    const rows = await query(
      `SELECT p.*, b.event_type, b.event_date, c.full_name
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       JOIN customers c ON c.id = b.customer_id
       ${filter.sql}
       ORDER BY p.payment_date DESC`,
      filter.params
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/payments/:id/qrcode", requireAuth, async (req, res, next) => {
  try {
    const [payment] = await query("SELECT * FROM payments WHERE id = ?", [req.params.id]);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Check customer filter
    const filter = bookingCustomerFilter(req.user, "b");
    const [booking] = await query(
      `SELECT b.* FROM bookings b WHERE b.id = ? ${filter.sql}`,
      [payment.booking_id, ...filter.params]
    );
    if (!booking) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const qrCodeDataURL = await generatePaymentQRCode(payment.id, payment.amount);
    res.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    next(error);
  }
});

router.post("/payments", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { booking_id, amount, payment_date, method, status } = req.body;
    await query("INSERT INTO payments (booking_id, amount, payment_date, method, status) VALUES (?, ?, ?, ?, ?)", [
      booking_id,
      amount,
      payment_date,
      method,
      status || "Partial",
    ]);
    res.status(201).json({ message: "Payment added." });
  } catch (error) {
    next(error);
  }
});

router.put("/payments/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { booking_id, amount, payment_date, method, status } = req.body;
    await query("UPDATE payments SET booking_id = ?, amount = ?, payment_date = ?, method = ?, status = ? WHERE id = ?", [
      booking_id,
      amount,
      payment_date,
      method,
      status,
      req.params.id,
    ]);
    res.json({ message: "Payment updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/payments/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    await query("DELETE FROM payments WHERE id = ?", [req.params.id]);
    res.json({ message: "Payment deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
