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

  const packageSeeds = [
    {
      name: "Classic Fiesta",
      description: "Rice, chicken, pork, pancit, vegetables, dessert, and drinks.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
      price: 12500,
      pax: 50,
    },
    {
      name: "Elegant Buffet",
      description: "Premium buffet with beef, seafood, pasta, salad, dessert, and drinks.",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",
      price: 28500,
      pax: 100,
    },
    {
      name: "Budget Party",
      description: "Affordable party set with rice, two viands, noodles, dessert, and juice.",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
      price: 7800,
      pax: 35,
    },
    {
      name: "Seafood Celebration",
      description: "Rice, grilled fish, shrimp, squid, chicken, salad, fruit, and iced tea.",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80",
      price: 21500,
      pax: 75,
    },
    {
      name: "Lechon Special",
      description: "Lechon, rice, pancit, chicken, vegetables, dessert, and soft drinks.",
      image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=900&q=80",
      price: 32000,
      pax: 120,
    },
    {
      name: "Dessert and Snack Table",
      description: "Cupcakes, pastries, kakanin, fruit cups, pasta, sandwiches, and juice.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
      price: 9800,
      pax: 50,
    },
  ];

  for (const item of packageSeeds) {
    const existing = await query("SELECT id, image_url FROM menu_packages WHERE package_name = ? LIMIT 1", [item.name]);
    if (!existing.length) {
      await query(
        `INSERT INTO menu_packages (package_name, description, image_url, price, pax)
         VALUES (?, ?, ?, ?, ?)`,
        [item.name, item.description, item.image, item.price, item.pax]
      );
    } else if (!existing[0].image_url) {
      await query("UPDATE menu_packages SET image_url = ? WHERE id = ?", [item.image, existing[0].id]);
    }
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
