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

    const customerClause = req.user.role === "customer" ? "AND b.customer_id = ?" : "";
    const customerParams = req.user.role === "customer" ? [req.user.customer_id || 0] : [];
    const [booking] = await query(
      `SELECT b.* FROM bookings b WHERE b.id = ? ${customerClause}`,
      [payment.booking_id, ...customerParams]
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
    const { booking_id, amount, payment_date, method, status, reference_number } = req.body;
    await query(
      `INSERT INTO payments (booking_id, amount, payment_date, method, status, reference_number, processed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
      booking_id,
      amount,
      payment_date,
      method,
      status || "Partial",
      reference_number || null,
      status === "Paid" ? new Date() : null,
    ]);
    res.status(201).json({ message: "Payment added." });
  } catch (error) {
    next(error);
  }
});

router.put("/payments/:id", requireAuth, requireEditor, async (req, res, next) => {
  try {
    const { booking_id, amount, payment_date, method, status, reference_number } = req.body;
    await query(
      `UPDATE payments
       SET booking_id = ?, amount = ?, payment_date = ?, method = ?, status = ?, reference_number = ?, processed_at = IF(? = 'Paid', COALESCE(processed_at, NOW()), processed_at)
       WHERE id = ?`,
      [
      booking_id,
      amount,
      payment_date,
      method,
      status,
      reference_number || null,
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

router.post("/payments/:id/gcash/process", requireAuth, async (req, res, next) => {
  try {
    const customerClause = req.user.role === "customer" ? "AND b.customer_id = ?" : "";
    const customerParams = req.user.role === "customer" ? [req.user.customer_id || 0] : [];
    const rows = await query(
      `SELECT p.id, p.amount, p.status, b.id AS booking_id
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       WHERE p.id = ? ${customerClause}`,
      [req.params.id, ...customerParams]
    );

    const payment = rows[0];
    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    if (payment.status === "Paid") {
      return res.json({ message: "Payment already paid.", reference_number: null });
    }

    const referenceNumber = `GCASH-${Date.now()}-${payment.id}`;
    await query(
      `UPDATE payments
       SET method = 'GCash', status = 'Paid', payment_date = CURDATE(), reference_number = ?, processed_at = NOW()
       WHERE id = ?`,
      [referenceNumber, payment.id]
    );

    res.json({
      message: "GCash payment processed in real time.",
      reference_number: referenceNumber,
      amount: payment.amount,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
