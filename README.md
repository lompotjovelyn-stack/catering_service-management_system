# Catering Service Management System

A Node.js + Express + MySQL web application for managing catering services including customers, bookings, menu packages, payments, and event schedules.

---

## Features

- Role-based login (Admin, Staff, Customer)
- Dashboard for each user type
- Customer management
- Menu package management
- Booking system
- Payment tracking
- Event schedules
- Summary dashboard

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
