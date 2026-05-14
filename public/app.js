function rolePath(role) {
  return {
    admin: "/admin.html",
    staff: "/staff.html",
    customer: "/customer.html",
  }[role] || "/";
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.querySelector("#login-message");
  message.textContent = "";

  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify(formData(event.target)),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = rolePath(data.user.role);
  } catch (error) {
    message.textContent = error.message;
  }
});

async function bootLogin() {
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !storedUser) return;

  try {
    const user = await api("/api/me");
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = rolePath(user.role);
  } catch (error) {
    localStorage.clear();
  }
}

bootLogin();
