# Catering Service Management System

A web-based platform to manage catering operations — including menu creation, event booking, customer records, staff assignment, inventory tracking, and billing. Suitable for small to medium catering businesses.

---

## Features

- Add, edit, delete food menus & packages
- Accept and manage booking requests
- Record customer details & history
- Assign staff and track availability
- Track ingredients & inventory stock
- Generate invoices & receipts
- Admin dashboard & reports

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- HTML, CSS, JavaScript

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Create environment file

```bash
copy .env.example .env
```

### 3. Configure `.env`

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=catering_service_db
```

### 4. Run the system

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Demo Accounts

| Role     | Username | Password    |
| -------- | -------- | ----------- |
| Admin    | admin    | admin123    |
| Staff    | staff    | staff123    |
| Customer | maria    | customer123 |

---

## Project Structure

```
server.js
src/
  config/
  database/
  middleware/
  routes/
  utils/
public/
  admin.html
  staff.html
  customer.html
  index.html
```

---

## Git Commands

```bash
git add .
git commit -m "clean README"
git push
```

---

## Notes

* MySQL must be running locally OR use online database for deployment
* Recommended for deployment: PlanetScale or Railway MySQL
