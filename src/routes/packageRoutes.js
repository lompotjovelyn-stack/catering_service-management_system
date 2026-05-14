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
    const { package_name, description, price, pax } = req.body;
    await query("INSERT INTO menu_packages (package_name, description, price, pax) VALUES (?, ?, ?, ?)", [
      package_name,
      description,
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
    const { package_name, description, price, pax } = req.body;
    await query("UPDATE menu_packages SET package_name = ?, description = ?, price = ?, pax = ? WHERE id = ?", [
      package_name,
      description,
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
    await query("DELETE FROM menu_packages WHERE id = ?", [req.params.id]);
    res.json({ message: "Package deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
