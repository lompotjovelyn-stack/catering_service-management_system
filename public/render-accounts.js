function renderAccounts(edit = {}) {
  if (!views.accounts || !canManageAccounts()) return;

  const customerOptions = `<option value="">No customer link</option>${optionList(state.customers, "full_name", edit.customer_id)}`;
  const formHtml = `
    <form class="form-grid" data-form="account">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Username<input name="username" value="${escapeHtml(edit.username)}" required /></label>
      <label>Password<input name="password" type="password" placeholder="${edit.id ? "Leave blank to keep current" : ""}" ${edit.id ? "" : "required"} /></label>
      <label>Role<select name="role" required>${["admin", "staff", "customer"].map((role) => `<option value="${role}" ${edit.role === role ? "selected" : ""}>${roleLabels[role]}</option>`).join("")}</select></label>
      <label>Customer link<select name="customer_id">${customerOptions}</select></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Account" : "Add Account"}</button>
        ${edit.id ? '<button type="button" data-cancel="accounts" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const rows = state.users
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.username)}</td>
          <td><span class="status">${escapeHtml(roleLabels[item.role] || item.role)}</span></td>
          <td>${escapeHtml(item.full_name || "None")}</td>
          <td>${formatDate(item.created_at)}</td>
          <td class="actions">
            <button data-edit-account="${item.id}">Edit</button>
            ${Number(item.id) === Number(state.user.id) ? "" : `<button class="danger" data-delete-account="${item.id}">Delete</button>`}
          </td>
        </tr>
      `
    )
    .join("");

  views.accounts.innerHTML = panel(
    "Login Accounts",
    formHtml,
    `<table><thead><tr><th>Username</th><th>Role</th><th>Customer</th><th>Created</th><th>Actions</th></tr></thead><tbody>${rows || emptyRow(5)}</tbody></table>`
  );
}
