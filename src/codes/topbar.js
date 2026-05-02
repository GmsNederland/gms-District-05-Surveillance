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
    // // Clock update
    // const clockEl = document.getElementById('clock');
    // setInterval(() => {
    //   const now = new Date();
    //   clockEl.textContent = now.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    // }, 1000);

    // // Roepnummer edit
    // function editRnr() {
    //   const span = document.getElementById('roepnummer');
    //   const input = document.getElementById('rnrInput');
    //   input.value = span.textContent === 'RNR instellen' ? '' : span.textContent;
    //   span.style.display = 'none';
    //   input.style.display = 'inline-block';
    //   input.focus();
    //   input.addEventListener('blur', saveRnr);
    //   input.addEventListener('keydown', e => { if(e.key==='Enter') saveRnr(); });
    // }
    // function saveRnr() {
    //   const span = document.getElementById('roepnummer');
    //   const input = document.getElementById('rnrInput');
    //   span.textContent = input.value.trim() || 'RNR instellen';
    //   span.style.display = 'inline-block';
    //   input.style.display = 'none';
    // }

    // // Status toggle
    // function toggleStatus() {
    //   const menu = document.getElementById('statusMenu');
    //   menu.style.display = (menu.style.display==='block') ? 'none' : 'block';
    // }

    // function setStatus(statusText, statusClass) {
    //   const btn = document.getElementById('statusBtn');
    //   btn.innerHTML = `<div class="dot ${statusClass}"></div ${statusText}▼`;
    //   document.getElementById('statusMenu').style.display = 'none';
    // }
