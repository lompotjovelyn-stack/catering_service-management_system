function renderPayments(edit = {}) {
  const title = state.user.role === "customer" ? "My Payments" : "Payment Records";
  const selectedBooking = state.bookings.find((item) => Number(item.id) === Number(edit.booking_id)) || state.bookings[0];
  const amount = edit.id ? edit.amount : bookingTotal(selectedBooking);
  const bookingOptions = state.bookings
    .map((item) => ({
      id: item.id,
      label: `${item.full_name} - ${item.event_type} (${formatDate(item.event_date)}) - ${peso(bookingTotal(item))}`,
    }))
    .map((item) => `<option value="${item.id}" ${Number(edit.booking_id) === Number(item.id) ? "selected" : ""}>${escapeHtml(item.label)}</option>`)
    .join("");

  const formHtml = `
    <form class="form-grid" data-form="payment">
      <input type="hidden" name="id" value="${edit.id || ""}" />
      <label class="wide">Booking<select name="booking_id" data-payment-booking required>${bookingOptions}</select></label>
      <label>Amount<input name="amount" data-payment-amount type="number" min="0" step="0.01" value="${amount || ""}" readonly required /></label>
      <label>Payment date<input name="payment_date" type="date" min="${todayInput()}" value="${dateInput(edit.payment_date) || todayInput()}" required /></label>
      <label>Method<select name="method" required>${["Cash", "GCash", "Bank Transfer"].map((method) => `<option value="${method}" ${edit.method === method ? "selected" : ""}>${method}</option>`).join("")}</select></label>
      <label>Status<select name="status">${["Unpaid", "Partial", "Paid", "Refunded"].map((status) => `<option ${edit.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
      <label class="wide">Reference no.<input name="reference_number" value="${escapeHtml(edit.reference_number)}" /></label>
      <div class="actions full">
        <button type="submit">${edit.id ? "Update Payment" : "Add Payment"}</button>
        ${edit.id ? '<button type="button" data-cancel="payments" class="ghost">Cancel</button>' : ""}
      </div>
    </form>
  `;

  const rows = state.payments
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.full_name)}</td>
          <td>${escapeHtml(item.event_type)}</td>
          <td>${peso(item.amount)}</td>
          <td>${formatDate(item.payment_date)}</td>
          <td>${escapeHtml(item.method)}</td>
          <td><span class="status">${escapeHtml(item.status)}</span></td>
          <td>${escapeHtml(item.reference_number || "")}</td>
          ${canEdit() ? `<td class="actions"><button data-view-qrcode="${item.id}" title="View QR Code">QR</button>${item.status !== "Paid" ? `<button class="secondary" data-process-gcash="${item.id}">Pay GCash</button>` : ""}<button data-edit-payment="${item.id}">Edit</button><button class="danger" data-delete-payment="${item.id}">Delete</button></td>` : `<td class="actions"><button data-view-qrcode="${item.id}" title="View QR Code">QR</button>${item.status !== "Paid" ? `<button class="secondary" data-process-gcash="${item.id}">Pay GCash</button>` : ""}</td>`}
        </tr>
      `
    )
    .join("");

  views.payments.innerHTML = panel(
    title,
    formHtml,
    `<table><thead><tr><th>Customer</th><th>Event</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th>Reference</th><th>Actions</th></tr></thead><tbody>${rows || emptyRow(8)}</tbody></table>`,
    canEdit()
  );
}
