const { query } = require("../config/database");
const { hashPassword } = require("../utils/password");

async function seedDatabase() {
  const customers = await query("SELECT COUNT(*) AS total FROM customers");
  if (customers[0].total === 0) {
    await query(
      "INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
      [
        "Maria Santos",
        "maria@example.com",
        "0917-111-2222",
        "Cebu City",
        "Juan Dela Cruz",
        "juan@example.com",
        "0928-333-4444",
        "Mandaue City",
      ]
    );
  }

  const packages = await query("SELECT COUNT(*) AS total FROM menu_packages");
  if (packages[0].total === 0) {
    await query(
      `INSERT INTO menu_packages (package_name, description, price, pax)
       VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)`,
      [
        "Classic Fiesta",
        "Rice, chicken, pork, pancit, vegetables, dessert, and drinks.",
        12500,
        50,
        "Elegant Buffet",
        "Premium buffet with beef, seafood, pasta, salad, dessert, and drinks.",
        28500,
        100,
        "Budget Party",
        "Affordable party set with rice, two viands, noodles, dessert, and juice.",
        7800,
        35,
      ]
    );
  }

  const users = await query("SELECT COUNT(*) AS total FROM users");
  if (users[0].total === 0) {
    const maria = await query("SELECT id FROM customers WHERE email = ?", ["maria@example.com"]);
    await query(
      `INSERT INTO users (username, password_hash, role, customer_id)
       VALUES (?, ?, 'admin', NULL), (?, ?, 'staff', NULL), (?, ?, 'customer', ?)`,
      [
        "admin",
        hashPassword("admin123"),
        "staff",
        hashPassword("staff123"),
        "maria",
        hashPassword("customer123"),
        maria[0]?.id || null,
      ]
    );
  }
}

module.exports = seedDatabase;
