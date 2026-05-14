function renderBookings(edit = {}) {
  const title = state.user.role === "customer" ? "My Bookings" : "Booking Records";
  const formHtml = `
    <form class="form-grid" data-form="booking">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label>Customer<select name="customer_id" required>${optionList(state.customers, "full_name", edit.customer_id)}</select></label>
      <label>Package<select name="package_id" required>${optionList(state.packages, "package_name", edit.package_id)}</select></label>
      <label>Event type<input name="event_type" value="${escapeHtml(edit.event_type)}" required /></label>
      <label>Event date<input name="event_date" type="date" value="${dateInput(edit.event_date)}" required /></label>
      <label>Event time<input name="event_time" type="time" value="${escapeHtml(edit.event_time)}" required /></label>
      <label>Venue<input name="venue" value="${escapeHtml(edit.venue)}" required /></label>
      <label>Guests<input name="guests" type="number" min="1" value="${edit.guests || ""}" required /></label>
      <label>Status<select name="status">${["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => `<option ${edit.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
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
          <td>${escapeHtml(item.package_name)}</td>
          <td>${escapeHtml(item.event_type)}</td>
          <td>${formatDate(item.event_date)}</td>
          <td>${escapeHtml(item.event_time)}</td>
          <td>${escapeHtml(item.venue)}</td>
          <td><span class="status">${escapeHtml(item.status)}</span></td>
          ${canEdit() ? `<td class="actions"><button data-edit-booking="${item.id}">Edit</button><button class="danger" data-delete-booking="${item.id}">Delete</button></td>` : ""}
        </tr>
      `
    )
    .join("");

  views.bookings.innerHTML = panel(
    title,
    formHtml,
    `<table><thead><tr><th>Customer</th><th>Package</th><th>Event</th><th>Date</th><th>Time</th><th>Venue</th><th>Status</th>${canEdit() ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows || emptyRow(canEdit() ? 8 : 7)}</tbody></table>`
  );
}
