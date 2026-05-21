const express = require("express");
const { query } = require("../config/database");
const { requireAuth, requireEditor } = require("../middleware/auth");

const router = express.Router();

router.get("/packages", requireAuth, async (req, res, next) => {
  try {
    res.json(await query("SELECT * FROM menu_packages ORDER BY created_at DESC"));
  } catch (error) {
    next(error);
  }
});

router.post("/packages", requireAuth, async (req, res, next) => {
  try {
    if (!["admin", "staff"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin and staff can add, edit, or delete packages." });
    }

    const { package_name, description, image_url, price, pax } = req.body;
    await query("INSERT INTO menu_packages (package_name, description, image_url, price, pax) VALUES (?, ?, ?, ?, ?)", [
      package_name,
      description,
      image_url || null,
      price,
      pax,
    ]);
    res.status(201).json({ message: "Package added." });
  } catch (error) {
    next(error);
  }
});

router.put("/packages/:id", requireAuth, async (req, res, next) => {
  try {
    if (!["admin", "staff"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin and staff can add, edit, or delete packages." });
    }

    const { package_name, description, image_url, price, pax } = req.body;
    await query("UPDATE menu_packages SET package_name = ?, description = ?, image_url = ?, price = ?, pax = ? WHERE id = ?", [
      package_name,
      description,
      image_url || null,
      price,
      pax,
      req.params.id,
    ]);
    res.json({ message: "Package updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/packages/:id", requireAuth, async (req, res, next) => {
  try {
    if (!["admin", "staff"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin and staff can add, edit, or delete packages." });
    }

    await query("DELETE FROM menu_packages WHERE id = ?", [req.params.id]);
    res.json({ message: "Package deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
