    // 🔥 MENU
window.toggleMenu = function(force = null) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !overlay) return;

  let open = sidebar.classList.contains("open");

  if (force !== null) open = force;

  sidebar.classList.toggle("open", open);
  overlay.classList.toggle("active", open);
};

// 🔥 STATUS
window.toggleStatus = function(e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("statusMenu");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

window.setStatus = function(text, cls) {
  const btn = document.getElementById("statusBtn");
  const menu = document.getElementById("statusMenu");

  if (!btn || !menu) return;

  btn.innerHTML = `<span class="dot ${cls}"></span> ${text} ▼`;
  menu.style.display = "none";
};

// 🔥 USER MENU
let sidebarOpen = false;

/* ================= SIDEBAR ================= */
window.toggleMenu = function(force = null) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !overlay) return;

  sidebarOpen = force !== null ? force : !sidebarOpen;

  sidebar.classList.toggle("open", sidebarOpen);
  overlay.classList.toggle("active", sidebarOpen);
};

/* ================= STATUS ================= */
window.toggleStatus = function(e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("statusMenu");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

window.setStatus = function(text, cls) {
  const btn = document.getElementById("statusBtn");
  const menu = document.getElementById("statusMenu");

  if (!btn || !menu) return;

  btn.innerHTML = `<span class="dot ${cls}"></span> ${text} ▼`;
  menu.style.display = "none";
};

/* ================= USER MENU ================= */
window.toggleUserMenu = function(e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("userMenu");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

/* ================= CLOCK ================= */
function updateClock() {
  const now = new Date();

  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (clock) clock.textContent = now.toLocaleTimeString("nl-NL");
  if (date) date.textContent = now.toLocaleDateString("nl-NL");
}

setInterval(updateClock, 1000);
updateClock();

/* ================= CLOSE MENUS ================= */
document.addEventListener("click", () => {
  const statusMenu = document.getElementById("statusMenu");
  const userMenu = document.getElementById("userMenu");

  if (statusMenu) statusMenu.style.display = "none";
  if (userMenu) userMenu.style.display = "none";
});

/* ================= ESC ================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleMenu(false);

    const statusMenu = document.getElementById("statusMenu");
    const userMenu = document.getElementById("userMenu");

    if (statusMenu) statusMenu.style.display = "none";
    if (userMenu) userMenu.style.display = "none";
  }
});

/*=================Logout popup ==========*/
window.openLogout = function() {
  document.getElementById("logoutModal").classList.remove("hidden");
};

window.closeLogout = function() {
  document.getElementById("logoutModal").classList.add("hidden");
};

window.logout = function() {
  // hier jouw firebase logout of redirect
  window.location.href = "/index.html";
};

/*===============Notifications===========*/
window.toggleNotifications = function(e) {
  if (e) e.stopPropagation();

  const panel = document.getElementById("notifPanel");
  if (!panel) return;

  panel.classList.toggle("show");
};

/* klik buiten sluiten */
document.addEventListener("click", () => {
  const panel = document.getElementById("notifPanel");
  if (panel) panel.classList.remove("show");
});
