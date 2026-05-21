const express = require("express");
const { query } = require("../config/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const categories = ["Main Dish", "Rice", "Dessert", "Drinks"];

function canManageFood(user) {
  return ["admin", "staff"].includes(user.role);
}

router.get("/food-items", requireAuth, async (req, res, next) => {
  try {
    const rows = await query("SELECT * FROM food_items ORDER BY FIELD(category, 'Main Dish', 'Rice', 'Dessert', 'Drinks'), food_name ASC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/food-items", requireAuth, async (req, res, next) => {
  try {
    if (!canManageFood(req.user)) {
      return res.status(403).json({ message: "Only admin and staff can manage food items." });
    }

    const { food_name, category, description, image_url } = req.body;
    if (!food_name || !categories.includes(category) || !description) {
      return res.status(400).json({ message: "Food name, valid category, and description are required." });
    }

    await query("INSERT INTO food_items (food_name, category, description, image_url) VALUES (?, ?, ?, ?)", [
      food_name,
      category,
      description,
      image_url || null,
    ]);
    res.status(201).json({ message: "Food item added." });
  } catch (error) {
    next(error);
  }
});

router.put("/food-items/:id", requireAuth, async (req, res, next) => {
  try {
    if (!canManageFood(req.user)) {
      return res.status(403).json({ message: "Only admin and staff can manage food items." });
    }

    const { food_name, category, description, image_url } = req.body;
    if (!food_name || !categories.includes(category) || !description) {
      return res.status(400).json({ message: "Food name, valid category, and description are required." });
    }

    await query(
      "UPDATE food_items SET food_name = ?, category = ?, description = ?, image_url = ? WHERE id = ?",
      [food_name, category, description, image_url || null, req.params.id]
    );
    res.json({ message: "Food item updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/food-items/:id", requireAuth, async (req, res, next) => {
  try {
    if (!canManageFood(req.user)) {
      return res.status(403).json({ message: "Only admin and staff can manage food items." });
    }

    await query("DELETE FROM food_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Food item deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
