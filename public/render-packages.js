function renderPackages(edit = {}) {
  const formHtml = `
    <form class="form-grid" data-form="package">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Package name<input name="package_name" value="${escapeHtml(edit.package_name)}" required /></label>
      <label>Price<input name="price" type="number" min="0" step="0.01" value="${edit.price || ""}" required /></label>
      <label>Pax<input name="pax" type="number" min="1" value="${edit.pax || ""}" required /></label>
      <label class="wide">Food image URL<input name="image_url" type="url" value="${escapeHtml(edit.image_url)}" placeholder="https://..." /></label>
      <label class="wide">Description<input name="description" value="${escapeHtml(edit.description)}" required /></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Package" : "Add Package"}</button>
        ${edit.id ? '<button type="button" data-cancel="packages" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const cards = state.packages
    .map(
      (item) => `
        <article class="package-card">
          <img src="${escapeHtml(item.image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80")}" alt="${escapeHtml(item.package_name)} food package" />
          <div class="package-card-body">
            <div>
              <h3>${escapeHtml(item.package_name)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </div>
            <div class="package-meta">
              <span>${peso(item.price)}</span>
              <span>${item.pax} pax</span>
            </div>
            ${canManagePackages() ? `<div class="actions"><button data-edit-package="${item.id}">Edit</button><button class="danger" data-delete-package="${item.id}">Delete</button></div>` : ""}
          </div>
        </article>
      `
    )
    .join("");

  views.packages.innerHTML = panel(
    "Menu Packages",
    formHtml,
    cards ? `<div class="package-grid">${cards}</div>` : `<table><tbody>${emptyRow(1, "No packages yet.")}</tbody></table>`,
    canManagePackages()
  );
}
