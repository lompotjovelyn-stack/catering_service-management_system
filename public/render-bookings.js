function bookingSelectedIds(edit) {
  return String(edit.selected_food_items || "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(Boolean);
}

function foodChoiceGrid(category, limit, selected) {
  const items = state.foodItems.filter((item) => item.category === category);
  return `
    <fieldset class="food-choice-group" data-category="${category}" data-limit="${limit}">
      <legend>${category} <span>${limit} ${limit === 1 ? "choice" : "choices"}</span></legend>
      <div class="food-choice-grid">
        ${items
          .map(
            (item) => `
              <label class="food-choice">
                <input type="checkbox" name="selected_food_items" value="${item.id}" ${selected.includes(Number(item.id)) ? "checked" : ""} />
                <img src="${escapeHtml(item.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80")}" alt="${escapeHtml(item.food_name)}" />
                <span>${escapeHtml(item.food_name)}</span>
              </label>
            `
          )
          .join("") || `<p class="muted">No ${category.toLowerCase()} available.</p>`}
      </div>
    </fieldset>
  `;
}

function renderBookings(edit = {}) {
  const title = state.user.role === "customer" ? "My Bookings" : "Booking Records";
  const customerId = state.user.role === "customer" ? state.user.customer_id : edit.customer_id;
  const orderType = edit.order_type || "Package";
  const selected = bookingSelectedIds(edit);
  const statusField = state.user.role !== "admin"
    ? `<input type="hidden" name="status" value="${escapeHtml(edit.status || "Pending")}" />`
    : `<label>Status<select name="status">${["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => `<option ${edit.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>`;

  const formHtml = `
    <form class="form-grid booking-form" data-form="booking">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      ${state.user.role === "customer" ? `<input type="hidden" name="customer_id" value="${customerId || ""}" />` : `<label>Customer<select name="customer_id" required>${optionList(state.customers, "full_name", customerId)}</select></label>`}
      <label>Order type<select name="order_type" data-order-type required>
        <option value="Package" ${orderType === "Package" ? "selected" : ""}>Package</option>
        <option value="Per Head" ${orderType === "Per Head" ? "selected" : ""}>Per head - PHP 250</option>
      </select></label>
      <label>Package<select name="package_id" required>${optionList(state.packages, "package_name", edit.package_id)}</select></label>
      <label>Event type<input name="event_type" value="${escapeHtml(edit.event_type)}" required /></label>
      <label>Event date<input name="event_date" type="date" min="${todayInput()}" value="${dateInput(edit.event_date)}" required /></label>
      <label>Event time<input name="event_time" type="time" value="${escapeHtml(edit.event_time)}" required /></label>
      <label>Venue<input name="venue" value="${escapeHtml(edit.venue)}" required /></label>
      <label>Guests<input name="guests" type="number" min="1" value="${edit.guests || ""}" required /></label>
      ${statusField}
      <div class="full per-head-builder ${orderType === "Per Head" ? "" : "hidden"}">
        <div class="menu-rule">
          <strong>Per head menu: PHP 250 per guest</strong>
          <span>Select exactly 3 main dishes, 1 rice, 1 dessert, and 1 drink.</span>
        </div>
        ${foodChoiceGrid("Main Dish", 3, selected)}
        ${foodChoiceGrid("Rice", 1, selected)}
        ${foodChoiceGrid("Dessert", 1, selected)}
        ${foodChoiceGrid("Drinks", 1, selected)}
      </div>
      <label class="full">Notes<textarea name="notes">${escapeHtml(edit.notes)}</textarea></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Booking" : "Add Booking"}</button>
        ${edit.id ? '<button type="button" data-cancel="bookings" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const rows = state.bookings
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.full_name)}</td>
          <td>${escapeHtml(item.order_type || "Package")}</td>
          <td>${escapeHtml(item.order_type === "Per Head" ? item.selected_food_names || "Custom menu" : item.package_name)}</td>
          <td>${escapeHtml(item.event_type)}</td>
          <td>${formatDate(item.event_date)}</td>
          <td>${escapeHtml(item.event_time)}</td>
          <td>${escapeHtml(item.venue)}</td>
          <td>${item.order_type === "Per Head" ? peso(Number(item.guests || 0) * 250) : peso(item.price)}</td>
          <td><span class="status">${escapeHtml(item.status)}</span></td>
          ${canManageBookings() ? `<td class="actions"><button data-edit-booking="${item.id}">Edit</button><button class="danger" data-delete-booking="${item.id}">Delete</button>${canApproveBookings() && item.status === "Pending" ? `<button data-approve-booking="${item.id}" class="secondary">Approve</button>` : ""}</td>` : ""}
        </tr>
      `
    )
    .join("");

  views.bookings.innerHTML = panel(
    title,
    formHtml,
    `<table><thead><tr><th>Customer</th><th>Type</th><th>Food Selected</th><th>Event</th><th>Date</th><th>Time</th><th>Venue</th><th>Total</th><th>Status</th>${canManageBookings() ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows || emptyRow(canManageBookings() ? 10 : 9)}</tbody></table>`,
    canManageBookings()
  );
}
