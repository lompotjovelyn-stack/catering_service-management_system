const foodCategories = ["Main Dish", "Rice", "Dessert", "Drinks"];

function renderPackages(edit = {}) {
  const editingFood = Boolean(edit.food_name);
  const packageFormHtml = `
    <form class="form-grid" data-form="package">
      <input type="hidden" name="id" value="${!editingFood && edit.id ? edit.id : ""}" />
      <label>Package name<input name="package_name" value="${!editingFood ? escapeHtml(edit.package_name) : ""}" required /></label>
      <label>Price<input name="price" type="number" min="0" step="0.01" value="${!editingFood ? edit.price || "" : ""}" required /></label>
      <label>Pax<input name="pax" type="number" min="1" value="${!editingFood ? edit.pax || "" : ""}" required /></label>
      <label class="wide">Package image URL<input name="image_url" type="url" value="${!editingFood ? escapeHtml(edit.image_url) : ""}" placeholder="https://..." /></label>
      <label class="wide">Description<input name="description" value="${!editingFood ? escapeHtml(edit.description) : ""}" required /></label>
      <div class="actions full">
        <button type="submit">${!editingFood && edit.id ? "Update Package" : "Add Package"}</button>
        ${!editingFood && edit.id ? '<button type="button" data-cancel="packages" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const foodFormHtml = `
    <form class="form-grid" data-form="food">
      <input type="hidden" name="id" value="${editingFood ? edit.id || "" : ""}" />
      <label>Food name<input name="food_name" value="${editingFood ? escapeHtml(edit.food_name) : ""}" required /></label>
      <label>Category<select name="category" required>${foodCategories.map((category) => `<option value="${category}" ${editingFood && edit.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></label>
      <label class="wide">Food image URL<input name="image_url" type="url" value="${editingFood ? escapeHtml(edit.image_url) : ""}" placeholder="https://..." /></label>
      <label class="wide">Description<input name="description" value="${editingFood ? escapeHtml(edit.description) : ""}" required /></label>
      <div class="actions full">
        <button type="submit">${editingFood && edit.id ? "Update Food" : "Add Food"}</button>
        ${editingFood && edit.id ? '<button type="button" data-cancel="packages" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const packageCards = state.packages
    .map(
      (item) => `
        <article class="package-card">
          <img src="${escapeHtml(item.image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80")}" alt="${escapeHtml(item.package_name)} package" />
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

  const categorySections = foodCategories
    .map((category) => {
      const cards = state.foodItems
        .filter((item) => item.category === category)
        .map(
          (item) => `
            <article class="food-card">
              <img src="${escapeHtml(item.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80")}" alt="${escapeHtml(item.food_name)}" />
              <div>
                <span>${escapeHtml(item.category)}</span>
                <h3>${escapeHtml(item.food_name)}</h3>
                <p>${escapeHtml(item.description)}</p>
                ${canManagePackages() ? `<div class="actions"><button data-edit-food="${item.id}">Edit</button><button class="danger" data-delete-food="${item.id}">Delete</button></div>` : ""}
              </div>
            </article>
          `
        )
        .join("");

      return `
        <section class="menu-category">
          <div class="panel-header"><h2>${category}</h2></div>
          <div class="food-grid">${cards || `<p class="muted menu-empty">No ${category.toLowerCase()} yet.</p>`}</div>
        </section>
      `;
    })
    .join("");

  views.packages.innerHTML = `
    <section class="menu-intro">
      <div>
        <p class="eyebrow">Food Menu</p>
        <h2>Choose by package or build a 250 per head menu.</h2>
      </div>
      <p>Per head selection allows 3 main dishes, 1 rice, 1 dessert, and 1 drink.</p>
    </section>
    ${canManagePackages() ? `<section class="panel"><div class="panel-header"><h2>Manage Packages</h2></div><div class="panel-body">${packageFormHtml}</div></section>` : ""}
    <section class="panel">
      <div class="panel-header"><h2>Food Packages</h2></div>
      ${packageCards ? `<div class="package-grid">${packageCards}</div>` : `<div class="panel-body"><p class="muted">No packages yet.</p></div>`}
    </section>
    ${canManagePackages() ? `<section class="panel"><div class="panel-header"><h2>Manage Food Items</h2></div><div class="panel-body">${foodFormHtml}</div></section>` : ""}
    ${categorySections}
  `;
}
