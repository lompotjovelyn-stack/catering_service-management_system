# Catering Service Management System

Simple Node.js, Express, MySQL, HTML, CSS, and JavaScript web app for managing customers, menu packages, bookings, payments, and event schedules.

## Setup

1. Create a MySQL connection in MySQL Workbench.
2. Copy `.env.example` to `.env` and update the MySQL username/password.
3. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

The app creates the database and tables automatically using `DB_NAME`.

## Backend file guide

- `server.js` - main Express entry point
- `src/config/database.js` - MySQL connection and query helper
- `src/database/init.js` - creates database tables
- `src/database/seed.js` - demo customers, packages, and users
- `src/middleware/auth.js` - login protection and admin/staff edit guard
- `src/middleware/errorHandler.js` - API error response handler
- `src/middleware/sessions.js` - in-memory login sessions
- `src/routes/index.js` - registers all API routes
- `src/routes/authRoutes.js` - login, logout, current user
- `src/routes/customerRoutes.js` - customer CRUD
- `src/routes/packageRoutes.js` - menu package CRUD
- `src/routes/bookingRoutes.js` - booking CRUD
- `src/routes/paymentRoutes.js` - payment CRUD
- `src/routes/scheduleRoutes.js` - event schedules
- `src/routes/summaryRoutes.js` - dashboard counts and upcoming events
- `src/routes/healthRoutes.js` - Render health check endpoint
- `src/utils/customerFilter.js` - customer-only data filtering
- `src/utils/password.js` - password hashing
- `src/utils/token.js` - login token generation

## Role pages

- Login page: `public/index.html`
- Admin page: `public/admin.html`
- Staff page: `public/staff.html`
- Customer page: `public/customer.html`

After login, the app redirects each user to their own page. Admin and staff can add, edit, and delete records. Customers can only view their own profile, bookings, payments, and schedules.

## Frontend file guide

- `public/app.js` - login and role redirect
- `public/dashboard-state.js` - shared state, views, and titles
- `public/dashboard-utils.js` - helper functions
- `public/dashboard-layout.js` - page layout helpers
- `public/dashboard-api.js` - API calls and save/delete functions
- `public/dashboard-events.js` - click, submit, nav, and logout events
- `public/dashboard-auth.js` - role page access check
- `public/render-customers.js` - customer table and form
- `public/render-packages.js` - menu package table and form
- `public/render-bookings.js` - booking table and form
- `public/render-payments.js` - payment table and form
- `public/render-schedules.js` - event schedule table
- `public/render-overview.js` - dashboard summary

## Demo accounts

- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`
- Customer: `maria` / `customer123`

