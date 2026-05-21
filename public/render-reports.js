function renderReports(summary = {}) {
  if (!views.reports) return;

  const completedBookings = state.bookings.filter((booking) => booking.status === "Completed").length;
  const pendingBookings = state.bookings.filter((booking) => booking.status === "Pending").length;
  const paidPayments = state.payments.filter((payment) => payment.status === "Paid");
  const paidTotal = paidPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
  const activeAccounts = state.users.length;
  const packageCounts = state.packages.map((pkg) => ({
    name: pkg.package_name,
    count: state.bookings.filter((booking) => Number(booking.package_id) === Number(pkg.id)).length,
    revenue: state.bookings
      .filter((booking) => Number(booking.package_id) === Number(pkg.id))
      .reduce((total, booking) => {
        const bookingPayments = state.payments.filter((payment) => Number(payment.booking_id) === Number(booking.id));
        return total + bookingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      }, 0),
  }));

  const rows = state.bookings
    .map((booking) => {
      const bookingPayments = state.payments.filter((payment) => Number(payment.booking_id) === Number(booking.id));
      const totalPaid = bookingPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);

      return `
        <tr>
          <td>${escapeHtml(booking.full_name)}</td>
          <td>${escapeHtml(booking.event_type)}</td>
          <td>${formatDate(booking.event_date)}</td>
          <td>${escapeHtml(booking.status)}</td>
          <td>${peso(totalPaid)}</td>
        </tr>
      `;
    })
    .join("");

  views.reports.innerHTML = `
    <div class="metric-grid">
      <article class="metric"><span>Total Revenue</span><strong>${peso(summary.revenue || paidTotal)}</strong></article>
      <article class="metric"><span>Completed Events</span><strong>${completedBookings}</strong></article>
      <article class="metric"><span>${state.user.role === "admin" ? "Login Accounts" : "Pending Bookings"}</span><strong>${state.user.role === "admin" ? activeAccounts : pendingBookings}</strong></article>
    </div>
    <section class="panel">
      <div class="panel-header"><h2>Booking Payment Report</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Event</th><th>Date</th><th>Status</th><th>Payments</th></tr></thead>
          <tbody>${rows || emptyRow(5, "No report data yet.")}</tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header"><h2>Package Report</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Package</th><th>Bookings</th><th>Paid Revenue</th></tr></thead>
          <tbody>${packageCounts.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.count}</td><td>${peso(item.revenue)}</td></tr>`).join("") || emptyRow(3, "No package data yet.")}</tbody>
        </table>
      </div>
    </section>
  `;
}
