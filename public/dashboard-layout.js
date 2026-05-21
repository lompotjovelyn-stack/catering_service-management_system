function showApp() {
  document.body.dataset.role = state.user.role;
  document.querySelector("#role-label").textContent = `${state.user.username} - ${roleLabels[state.user.role] || state.user.role}`;
  document.querySelector("#permission-note").textContent = "";
}

function setActiveView(name) {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  Object.entries(views).forEach(([key, view]) => {
    if (!view) return;
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

function panel(title, formHtml, tableHtml, showForm = canEdit()) {
  return `
    <section class="panel">
      <div class="panel-header">
        <h2>${title}</h2>
      </div>
      ${showForm ? `<div class="panel-body">${formHtml}</div>` : ""}
      <div class="table-wrap">${tableHtml}</div>
    </section>
  `;
}
