document.querySelector("#logout-btn").addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" }).catch(() => {});
  localStorage.clear();
  state.token = null;
  state.user = null;
  delete document.body.dataset.role;
  window.location.href = "/";
});

document.querySelectorAll(".nav-link").forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  const type = form.dataset.form;
  if (!type) return;

  event.preventDefault();
  const resource = {
    customer: "customers",
    package: "packages",
    booking: "bookings",
    payment: "payments",
  }[type];

  try {
    await saveRecord(resource, formData(form));
  } catch (error) {
    alert(error.message);
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.dataset.cancel) {
    renderCustomers();
    renderPackages();
    renderBookings();
    renderPayments();
  }

  const editMap = [
    ["editCustomer", state.customers, renderCustomers],
    ["editPackage", state.packages, renderPackages],
    ["editBooking", state.bookings, renderBookings],
    ["editPayment", state.payments, renderPayments],
  ];

  editMap.forEach(([key, list, render]) => {
    if (target.dataset[key]) {
      render(list.find((item) => Number(item.id) === Number(target.dataset[key])));
    }
  });

  const deleteMap = [
    ["deleteCustomer", "customers"],
    ["deletePackage", "packages"],
    ["deleteBooking", "bookings"],
    ["deletePayment", "payments"],
  ];

  if (target.dataset.approveBooking) {
    try {
      await api(`/api/bookings/${target.dataset.approveBooking}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Confirmed" }),
      });
      await loadAll();
    } catch (error) {
      alert(error.message);
    }
  }

  if (target.dataset.viewQrcode) {
    try {
      const response = await api(`/api/payments/${target.dataset.viewQrcode}/qrcode`);
      const payment = state.payments.find((p) => Number(p.id) === Number(target.dataset.viewQrcode));
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>Payment QR Code</h2>
            <button class="close" onclick="this.closest('.modal').remove()">×</button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 20px;">
            <img src="${response.qrCode}" alt="Payment QR Code" style="max-width: 300px; border-radius: 8px;" />
            <p style="margin-top: 15px; color: #666;">
              Payment ID: <strong>${payment.id}</strong><br/>
              Amount: <strong>${peso(payment.amount)}</strong>
            </p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });
    } catch (error) {
      alert(error.message);
    }
  }

  for (const [key, resource] of deleteMap) {
    if (target.dataset[key]) {
      try {
        await deleteRecord(resource, target.dataset[key]);
      } catch (error) {
        alert(error.message);
      }
    }
  }
});
