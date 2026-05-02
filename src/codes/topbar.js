/* ================= STATE ================= */
let sidebarOpen = false;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
});

/* ================= SIDEBAR ================= */
window.toggleMenu = function (force = null) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !overlay) return;

  sidebarOpen = force !== null ? force : !sidebarOpen;

  sidebar.classList.toggle("open", sidebarOpen);
  overlay.classList.toggle("active", sidebarOpen);
};

/* ================= STATUS ================= */
window.toggleStatus = function (e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("statusMenu");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

window.setStatus = function (text, cls) {
  const btn = document.getElementById("statusBtn");
  const menu = document.getElementById("statusMenu");

  if (!btn || !menu) return;

  btn.innerHTML = `<span class="dot ${cls}"></span> ${text} ▼`;
  menu.style.display = "none";
};

/* ================= USER MENU ================= */
window.toggleUserMenu = function (e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("userMenu");
  if (!menu) return;

  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
};

/* ================= NOTIFICATIONS ================= */
window.toggleNotifications = function (e) {
  if (e) e.stopPropagation();

  const panel = document.getElementById("notifPanel");
  if (!panel) return;

  panel.classList.toggle("show");
};

/* ================= LOGOUT ================= */
window.openLogout = () =>
  document.getElementById("logoutModal")?.classList.remove("hidden");

window.closeLogout = () =>
  document.getElementById("logoutModal")?.classList.add("hidden");

window.logout = () => {
  // Vercel safe redirect
  window.location.href = "/";
};

/* ================= CLOCK ================= */
function updateClock() {
  const now = new Date();

  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (clock) clock.textContent = now.toLocaleTimeString("nl-NL");
  if (date) date.textContent = now.toLocaleDateString("nl-NL");
}

/* ================= CLOSE ON CLICK OUTSIDE ================= */
document.addEventListener("click", () => {
  const statusMenu = document.getElementById("statusMenu");
  const userMenu = document.getElementById("userMenu");
  const notifPanel = document.getElementById("notifPanel");

  if (statusMenu) statusMenu.style.display = "none";
  if (userMenu) userMenu.style.display = "none";
  if (notifPanel) notifPanel.classList.remove("show");
});

/* ================= ESC ================= */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  toggleMenu(false);

  document.getElementById("statusMenu")?.style &&
    (document.getElementById("statusMenu").style.display = "none");

  document.getElementById("userMenu")?.style &&
    (document.getElementById("userMenu").style.display = "none");

  document.getElementById("notifPanel")?.classList?.remove("show");
});