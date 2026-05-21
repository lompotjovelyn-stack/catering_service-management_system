async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: state.token ? `Bearer ${state.token}` : "",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

async function loadAll() {
  const [summary, customers, packagesData, foodItems, bookings, payments, users] = await Promise.all([
    api("/api/summary"),
    api("/api/customers"),
    api("/api/packages"),
    api("/api/food-items"),
    api("/api/bookings"),
    api("/api/payments"),
    canManageAccounts() ? api("/api/users") : Promise.resolve([]),
  ]);

  state.customers = customers;
  state.packages = packagesData;
  state.foodItems = foodItems;
  state.bookings = bookings;
  state.payments = payments;
  state.users = users;

  renderOverview(summary);
  renderCustomers();
  renderPackages();
  renderBookings();
  renderPayments();
  renderSchedules();
  if (views.accounts) renderAccounts();
  if (views.reports) renderReports(summary);
}

async function saveRecord(resource, payload) {
  const id = payload.id;
  delete payload.id;
  await api(`/api/${resource}${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  await loadAll();
}

async function deleteRecord(resource, id) {
  if (!confirm("Delete this record?")) return;
  await api(`/api/${resource}/${id}`, { method: "DELETE" });
  await loadAll();
}
