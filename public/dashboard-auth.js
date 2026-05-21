async function bootDashboard(expectedRole) {
  if (!state.token || !state.user) {
    window.location.href = "/";
    return;
  }

  try {
    const user = await api("/api/me");
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role !== expectedRole) {
      window.location.href = rolePath(user.role);
      return;
    }

    showApp();
    await loadAll();
  } catch (error) {
    localStorage.clear();
    window.location.href = "/";
  }
}
