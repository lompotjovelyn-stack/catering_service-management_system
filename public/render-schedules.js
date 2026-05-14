function renderSchedules() {
  const title = state.user.role === "customer" ? "My Schedule" : "Event Schedules";
  const rows = state.bookings
    .map(
      (item) => `
        <tr>
          <td>${formatDate(item.event_date)}</td>
          <td>${escapeHtml(item.event_time)}</td>
          <td>${escapeHtml(item.full_name)}</td>
          <td>${escapeHtml(item.event_type)}</td>
          <td>${escapeHtml(item.package_name)}</td>
          <td>${escapeHtml(item.venue)}</td>
          <td>${item.guests}</td>
          <td><span class="status">${escapeHtml(item.status)}</span></td>
        </tr>
      `
    )
    .join("");

  views.schedules.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <h2>${title}</h2>
        <span class="pill">${state.bookings.length} scheduled</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Time</th><th>Customer</th><th>Event</th><th>Package</th><th>Venue</th><th>Guests</th><th>Status</th></tr></thead>
          <tbody>${rows || emptyRow(8)}</tbody>
        </table>
      </div>
    </section>
  `;
}
