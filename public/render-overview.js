function renderOverview(summary) {
  document.querySelector("#metric-customers").textContent = summary.customers;
  document.querySelector("#metric-bookings").textContent = summary.bookings;
  document.querySelector("#metric-revenue").textContent = peso(summary.revenue);

  document.querySelector("#upcoming-table").innerHTML =
    summary.upcoming
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.full_name)}</td>
            <td>${escapeHtml(row.event_type)}</td>
            <td>${formatDate(row.event_date)}</td>
            <td>${escapeHtml(row.event_time)}</td>
            <td>${escapeHtml(row.venue)}</td>
            <td><span class="status">${escapeHtml(row.status)}</span></td>
          </tr>
        `
      )
      .join("") || emptyRow(6);
}
