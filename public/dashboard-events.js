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
    food: "food-items",
    booking: "bookings",
    payment: "payments",
    account: "users",
  }[type];

  try {
    if (type === "booking" && form.querySelector("[data-order-type]")?.value === "Per Head") {
      const requirements = [
        ["Main Dish", 3],
        ["Rice", 1],
        ["Dessert", 1],
        ["Drinks", 1],
      ];
      for (const [category, count] of requirements) {
        const checked = form.querySelectorAll(`.food-choice-group[data-category="${category}"] input:checked`).length;
        if (checked !== count) {
          alert(`Per head menu requires ${count} ${category} choice${count > 1 ? "s" : ""}.`);
          return;
        }
      }
    }

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
    if (views.accounts && typeof renderAccounts === "function") renderAccounts();
    if (views.reports && typeof renderReports === "function") renderReports();
  }

  const editMap = [
    ["editCustomer", state.customers, renderCustomers],
    ["editPackage", state.packages, renderPackages],
    ["editFood", state.foodItems, renderPackages],
    ["editBooking", state.bookings, renderBookings],
    ["editPayment", state.payments, renderPayments],
  ];
  if (views.accounts && typeof renderAccounts === "function") {
    editMap.push(["editAccount", state.users, renderAccounts]);
  }

  editMap.forEach(([key, list, render]) => {
    if (target.dataset[key]) {
      render(list.find((item) => Number(item.id) === Number(target.dataset[key])));
    }
  });

  const deleteMap = [
    ["deleteCustomer", "customers"],
    ["deletePackage", "packages"],
    ["deleteFood", "food-items"],
    ["deleteBooking", "bookings"],
    ["deletePayment", "payments"],
    ["deleteAccount", "users"],
  ];

  if (target.dataset.approveBooking) {
    try {
      const booking = state.bookings.find((item) => Number(item.id) === Number(target.dataset.approveBooking));
      if (!booking) {
        alert("Booking not found.");
        return;
      }

      await api(`/api/bookings/${target.dataset.approveBooking}`, {
        method: "PUT",
        body: JSON.stringify({
          customer_id: booking.customer_id,
          package_id: booking.package_id,
          order_type: booking.order_type || "Package",
          selected_food_items: booking.selected_food_items || "",
          event_type: booking.event_type,
          event_date: dateInput(booking.event_date),
          event_time: booking.event_time,
          venue: booking.venue,
          guests: booking.guests,
          notes: booking.notes || "",
          status: "Confirmed",
        }),
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
            <button class="close" onclick="this.closest('.modal').remove()">x</button>
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

  if (target.dataset.processGcash) {
    try {
      target.disabled = true;
      target.textContent = "Processing...";
      const response = await api(`/api/payments/${target.dataset.processGcash}/gcash/process`, {
        method: "POST",
      });
      alert(`${response.message}${response.reference_number ? `\nReference: ${response.reference_number}` : ""}`);
      await loadAll();
    } catch (error) {
      alert(error.message);
      target.disabled = false;
      target.textContent = "Pay GCash";
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

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("[data-order-type]")) {
    const form = target.closest("form");
    const builder = form?.querySelector(".per-head-builder");
    if (builder) {
      builder.classList.toggle("hidden", target.value !== "Per Head");
    }
  }

  if (target.matches("[data-payment-booking]")) {
    const booking = state.bookings.find((item) => Number(item.id) === Number(target.value));
    const amountInput = target.closest("form")?.querySelector("[data-payment-amount]");
    if (amountInput) {
      amountInput.value = bookingTotal(booking).toFixed(2);
    }
  }

  if (target.matches('.food-choice input[type="checkbox"]')) {
    const group = target.closest(".food-choice-group");
    const limit = Number(group?.dataset.limit || 0);
    const checked = group ? Array.from(group.querySelectorAll('input[type="checkbox"]:checked')) : [];
    if (limit && checked.length > limit) {
      target.checked = false;
      alert(`You can select only ${limit} ${group.dataset.category} item${limit > 1 ? "s" : ""}.`);
    }
  }
});
