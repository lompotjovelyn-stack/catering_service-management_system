# Catering Service Management System

A simple catering management web app built with Node.js, Express, MySQL, HTML, CSS, and JavaScript.

The system manages customers, menu packages, bookings, payments, and event schedules. It includes separate dashboard pages for admin, staff, and customer users.

## Features

- User login with role-based redirects
- Admin, staff, and customer dashboards
- Customer management
- Menu package management
- Booking management
- Payment tracking
- Event schedule view
- Dashboard summary cards and upcoming events
- MySQL database setup and seed data

## Requirements

- Node.js
- MySQL Server
- MySQL Workbench, optional but recommended
- Git

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a MySQL connection in MySQL Workbench.

3. Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

4. Open `.env` and update your MySQL settings:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=catering_service_db
```

5. Start the app:

```bash
npm run dev
```

6. Open the app in your browser:

```text
http://localhost:3000
```

The app automatically creates the database and tables using the value from `DB_NAME`.

## Scripts

```bash
npm run dev
```

Starts the app with `nodemon` for development.

```bash
npm start
```

Starts the app with Node.

```bash
npm test
```

Checks `server.js` for syntax errors.

## Demo Accounts

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Staff | `staff` | `staff123` |
| Customer | `maria` | `customer123` |

## Role Pages

- Login page: `public/index.html`
- Admin dashboard: `public/admin.html`
- Staff dashboard: `public/staff.html`
- Customer dashboard: `public/customer.html`

After login, users are redirected to the correct dashboard for their role.

Admin and staff users can add, edit, and delete records. Customer users can only view their own profile, bookings, payments, and schedules.

## Database Tables

The app creates these tables automatically:

- `customers`
- `users`
- `menu_packages`
- `bookings`
- `payments`

Seed data is inserted only when the related tables are empty.

## Backend File Guide

- `server.js` - main Express entry point
- `src/config/database.js` - MySQL connection and query helper
- `src/database/init.js` - creates database tables
- `src/database/seed.js` - inserts demo customers, packages, and users
- `src/middleware/auth.js` - login protection and role guards
- `src/middleware/errorHandler.js` - API error response handler
- `src/middleware/sessions.js` - in-memory login sessions
- `src/routes/index.js` - registers all API routes
- `src/routes/authRoutes.js` - login, logout, and current user routes
- `src/routes/customerRoutes.js` - customer CRUD routes
- `src/routes/packageRoutes.js` - menu package CRUD routes
- `src/routes/bookingRoutes.js` - booking CRUD routes
- `src/routes/paymentRoutes.js` - payment CRUD routes
- `src/routes/scheduleRoutes.js` - event schedule routes
- `src/routes/summaryRoutes.js` - dashboard summary routes
- `src/routes/healthRoutes.js` - health check route
- `src/utils/customerFilter.js` - customer-only data filtering
- `src/utils/password.js` - password hashing
- `src/utils/token.js` - login token generation

## Frontend File Guide

- `public/app.js` - login and role redirect
- `public/dashboard-state.js` - shared state, views, and titles
- `public/dashboard-utils.js` - helper functions
- `public/dashboard-layout.js` - dashboard layout helpers
- `public/dashboard-api.js` - API calls and save/delete functions
- `public/dashboard-events.js` - click, submit, navigation, and logout events
- `public/dashboard-auth.js` - role page access check
- `public/render-customers.js` - customer table and form
- `public/render-packages.js` - menu package table and form
- `public/render-bookings.js` - booking table and form
- `public/render-payments.js` - payment table and form
- `public/render-schedules.js` - event schedule table
- `public/render-overview.js` - dashboard summary

## Git Commit Steps

After editing files, use:

```bash
git status
git add .
git commit -m "Fix README documentation"
git push
```
