function renderPackages(edit = {}) {
  const formHtml = `
    <form class="form-grid" data-form="package">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Package name<input name="package_name" value="${escapeHtml(edit.package_name)}" required /></label>
      <label>Price<input name="price" type="number" min="0" step="0.01" value="${edit.price || ""}" required /></label>
      <label>Pax<input name="pax" type="number" min="1" value="${edit.pax || ""}" required /></label>
      <label class="wide">Description<input name="description" value="${escapeHtml(edit.description)}" required /></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Package" : "Add Package"}</button>
        ${edit.id ? '<button type="button" data-cancel="packages" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const rows = state.packages
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.package_name)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${peso(item.price)}</td>
          <td>${item.pax}</td>
          ${canEdit() ? `<td class="actions"><button data-edit-package="${item.id}">Edit</button><button class="danger" data-delete-package="${item.id}">Delete</button></td>` : ""}
        </tr>
      `
    )
    .join("");

  views.packages.innerHTML = panel(
    "Menu Packages",
    formHtml,
    `<table><thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Pax</th>${canEdit() ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows || emptyRow(canEdit() ? 5 : 4)}</tbody></table>`
  );
}
