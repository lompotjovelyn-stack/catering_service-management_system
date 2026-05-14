function showApp() {
  document.body.dataset.role = state.user.role;
  document.querySelector("#role-label").textContent = `${state.user.username} - ${roleLabels[state.user.role] || state.user.role}`;
  document.querySelector("#permission-note").textContent = canEdit()
    ? "Admin and staff access: add, edit, delete enabled"
    : "Customer access: own records only, view only";
}

function setActiveView(name) {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  Object.entries(views).forEach(([key, view]) => {
    view.classList.toggle("active-view", key === name);
  });
  document.querySelector("#page-title").textContent = titles[name];
}

function emptyRow(cols, text = "No records yet.") {
  return `<tr><td colspan="${cols}" class="muted">${text}</td></tr>`;
}

function optionList(items, labelKey, selected) {
  return items
    .map((item) => `<option value="${item.id}" ${Number(selected) === Number(item.id) ? "selected" : ""}>${escapeHtml(item[labelKey])}</option>`)
    .join("");
}

function panel(title, formHtml, tableHtml) {
  return `
    <section class="panel">
      <div class="panel-header">
        <h2>${title}</h2>
        <span class="pill role-pill">${canEdit() ? "Editable by admin/staff" : "Customer view only"}</span>
      </div>
      ${canEdit() ? `<div class="panel-body">${formHtml}</div>` : ""}
      <div class="table-wrap">${tableHtml}</div>
    </section>
  `;
}
