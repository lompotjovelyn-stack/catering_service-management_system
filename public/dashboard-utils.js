function rolePath(role) {
  return {
    admin: "/admin.html",
    staff: "/staff.html",
    customer: "/customer.html",
  }[role] || "/";
}

function canEdit() {
  return state.user && ["admin", "staff"].includes(state.user.role);
}

function canManagePackages() {
  return state.user && ["admin", "staff"].includes(state.user.role);
}

function canEditCustomerProfile(item) {
  return canEdit() || (state.user && state.user.role === "customer" && Number(item.id) === Number(state.user.customer_id));
}

function canManageBookings() {
  return Boolean(state.user);
}

function canApproveBookings() {
  return state.user && state.user.role === "admin";
}

function bookingTotal(booking) {
  if (!booking) return 0;
  if (booking.order_type === "Per Head") {
    return Number(booking.guests || 0) * Number(booking.per_head_price || 250);
  }
  return Number(booking.price || 0);
}

function canManageAccounts() {
  return state.user && state.user.role === "admin";
}

function peso(value) {
  return Number(value || 0).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function dateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function todayInput() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formData(form) {
  const data = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    } else {
      data[key] = value;
    }
  }
  return data;
}
