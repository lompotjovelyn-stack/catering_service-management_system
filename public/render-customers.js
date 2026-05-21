function renderCustomers(edit = {}) {
  const title = state.user.role === "customer" ? "My Profile" : "Customer Records";
  const profile = state.user.role === "customer" ? state.customers[0] || {} : null;
  if (profile && !edit.id) {
    edit = profile;
  }

  const formHtml = `
    <form class="form-grid" data-form="customer">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Full name<input name="full_name" value="${escapeHtml(edit.full_name)}" required /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(edit.email)}" required /></label>
      <label>Phone<input name="phone" value="${escapeHtml(edit.phone)}" required /></label>
      <label>Address<input name="address" value="${escapeHtml(edit.address)}" required /></label>
      <div class="actions full">
        <button type="submit">${state.user.role === "customer" ? "Update Profile" : edit.id ? "Update Customer" : "Add Customer"}</button>
        ${edit.id && state.user.role !== "customer" ? '<button type="button" data-cancel="customers" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  if (state.user.role === "customer") {
    const nextBooking = state.bookings[0];
    views.customers.innerHTML = `
      <div class="profile-grid">
        <article class="metric"><span>Account</span><strong>${escapeHtml(state.user.username)}</strong></article>
        <article class="metric"><span>Total Bookings</span><strong>${state.bookings.length}</strong></article>
        <article class="metric"><span>Total Paid</span><strong>${peso(state.payments.reduce((total, payment) => total + Number(payment.amount || 0), 0))}</strong></article>
      </div>
      <section class="panel">
        <div class="panel-header"><h2>Profile Information</h2></div>
        <div class="panel-body">${formHtml}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><h2>Customer Details</h2></div>
        <div class="profile-details">
          <div><span>Name</span><strong>${escapeHtml(profile.full_name || "")}</strong></div>
          <div><span>Email</span><strong>${escapeHtml(profile.email || "")}</strong></div>
          <div><span>Phone</span><strong>${escapeHtml(profile.phone || "")}</strong></div>
          <div><span>Address</span><strong>${escapeHtml(profile.address || "")}</strong></div>
          <div><span>Next Event</span><strong>${nextBooking ? `${escapeHtml(nextBooking.event_type)} on ${formatDate(nextBooking.event_date)}` : "No booking yet"}</strong></div>
        </div>
      </section>
    `;
    return;
  }

  const rows = state.customers
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.full_name)}</td>
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(item.phone)}</td>
          <td>${escapeHtml(item.address)}</td>
          ${canEditCustomerProfile(item) ? `<td class="actions"><button data-edit-customer="${item.id}">Edit</button><button class="danger" data-delete-customer="${item.id}">Delete</button></td>` : ""}
        </tr>
      `
    )
    .join("");

  views.customers.innerHTML = panel(
    title,
    formHtml,
    `<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th>${canEdit() ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows || emptyRow(canEdit() ? 5 : 4)}</tbody></table>`
  );
}
