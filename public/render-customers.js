function renderCustomers(edit = {}) {
  const title = state.user.role === "customer" ? "My Profile" : "Customer Records";
  const formHtml = `
    <form class="form-grid" data-form="customer">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Full name<input name="full_name" value="${escapeHtml(edit.full_name)}" required /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(edit.email)}" required /></label>
      <label>Phone<input name="phone" value="${escapeHtml(edit.phone)}" required /></label>
      <label>Address<input name="address" value="${escapeHtml(edit.address)}" required /></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Customer" : "Add Customer"}</button>
        ${edit.id ? '<button type="button" data-cancel="customers" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const rows = state.customers
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.full_name)}</td>
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(item.phone)}</td>
          <td>${escapeHtml(item.address)}</td>
          ${canEdit() ? `<td class="actions"><button data-edit-customer="${item.id}">Edit</button><button class="danger" data-delete-customer="${item.id}">Delete</button></td>` : ""}
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
