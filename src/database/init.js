const { connectDatabase, getPool } = require("../config/database");
const seedDatabase = require("./seed");

async function initDatabase() {
  await connectDatabase();
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      phone VARCHAR(40) NOT NULL,
      address VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(60) NOT NULL UNIQUE,
      password_hash VARCHAR(64) NOT NULL,
      role ENUM('admin', 'staff', 'customer') NOT NULL,
      customer_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      package_name VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      pax INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      package_id INT NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      event_date DATE NOT NULL,
      event_time TIME NOT NULL,
      venue VARCHAR(255) NOT NULL,
      guests INT NOT NULL,
      status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
      notes TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES menu_packages(id) ON DELETE RESTRICT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_date DATE NOT NULL,
      method VARCHAR(60) NOT NULL,
      status ENUM('Unpaid', 'Partial', 'Paid', 'Refunded') NOT NULL DEFAULT 'Partial',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    )
  `);

  await seedDatabase();
}

module.exports = initDatabase;
