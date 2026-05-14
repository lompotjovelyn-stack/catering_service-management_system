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
  return state.user && ["admin", "staff", "customer"].includes(state.user.role);
}

function canManageBookings() {
  return Boolean(state.user);
}

function canApproveBookings() {
  return state.user && ["admin", "staff"].includes(state.user.role);
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}
