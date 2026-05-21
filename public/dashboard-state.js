const state = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  customers: [],
  packages: [],
  bookings: [],
  payments: [],
  users: [],
};

const views = {
  overview: document.querySelector("#overview-view"),
  customers: document.querySelector("#customers-view"),
  packages: document.querySelector("#packages-view"),
  bookings: document.querySelector("#bookings-view"),
  payments: document.querySelector("#payments-view"),
  schedules: document.querySelector("#schedules-view"),
  accounts: document.querySelector("#accounts-view"),
  reports: document.querySelector("#reports-view"),
};

const titles = {
  overview: "Overview",
  customers: document.body.dataset.pageRole === "customer" ? "My Profile" : "Customers",
  packages: "Menu Packages",
  bookings: document.body.dataset.pageRole === "customer" ? "My Bookings" : "Bookings",
  payments: document.body.dataset.pageRole === "customer" ? "My Payments" : "Payments",
  schedules: document.body.dataset.pageRole === "customer" ? "My Schedule" : "Event Schedules",
  accounts: "Accounts",
  reports: "Reports",
};

const roleLabels = {
  admin: "Admin",
  staff: "Staff",
  customer: "Customer",
};
