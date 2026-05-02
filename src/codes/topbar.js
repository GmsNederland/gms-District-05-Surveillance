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
function createTopbar() {
  const el = document.getElementById("topbar-container");
  if (!el) return;

  el.innerHTML = `
    <div class="topbar" id="topbar">

      <div class="left">
        <div class="brand">D05·GMS</div>
      </div>

      <div class="center">
        <div id="clock"></div>
        <div id="date"></div>
      </div>

      <div class="right">

        <button onclick="toggleNotifications(event)">🔔</button>

        <div class="user" onclick="toggleUserMenu(event)">
          👤 ${getUserEmail()}
          
          <div id="userMenu" class="userMenu">
            <div onclick="openLogout()">🚪 Uitloggen</div>
          </div>
        </div>

      </div>

    </div>
  `;

  initClock();
}

/* ================= USER ================= */
function getUserEmail() {
  return window.firebase?.auth()?.currentUser?.email || "guest";
}

/* ================= CLOCK ================= */
function initClock() {
  function updateClock() {
    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (clock) clock.textContent = now.toLocaleTimeString("nl-NL");
    if (date) date.textContent = now.toLocaleDateString("nl-NL");
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("topbar-container");
  if (!el) return;

  el.innerHTML = `
  
  <!-- OVERLAY -->
  <div id="overlay" onclick="toggleMenu(false)"></div>

  <!-- SIDEBAR -->
  <div id="sidebar">

    <div class="sidebar-header">
      <div class="logo">D05 GMS</div>
      <div class="sub">Dispatch System</div>
    </div>

    <div class="sidebar-section">

      <a class="nav-item active" href="/src/pages/rolenselect.html">
        🏠 Dashboard
      </a>

      <a class="nav-item" href="/src/pages/panels/meldkamer.html">
        🚨 Meldkamer
      </a>

      <a class="nav-item" href="#">
        🚓 Eenheden
      </a>

      <a class="nav-item" href="/src/pages/accountsettings.html">
        ⚙️ Instellingen
      </a>

    </div>

  </div>

  <!-- TOPBAR -->
  <div id="topbar">

    <div class="left">
      <div class="hamburger" onclick="toggleMenu()">☰</div>
      <strong>D05·GMS</strong>

      <div class="conn online">API</div>
      <div class="conn offline">RBLX</div>
      <div class="conn warn">RTDB</div>
    </div>

    <div class="right">

      <div class="datetime">
        <div id="date"></div>
        <div id="clock"></div>
      </div>

      <div class="notifBox" onclick="toggleNotifications(event)">
        🔔
      </div>

      <div class="userBox" onclick="toggleUserMenu(event)">
        👤 ${getUser()}

        <div id="userMenu" class="userMenu">
          <div onclick="openprofile()">👤 Profiel</div>
          <div onclick="settingsopen()">⚙️ Instellingen</div>
          <div onclick="openLogout()">🚪 Uitloggen</div>
        </div>
      </div>

    </div>

  </div>

  <!-- MODALS -->
  <div id="logoutModal" class="modal hidden">
    <div class="modal-box">
      <h3>Uitloggen bevestigen</h3>
      <button onclick="closeLogout()">Annuleren</button>
      <button onclick="logout()">Uitloggen</button>
    </div>
  </div>

  <div id="notifPanel" class="notifPanel">
    🚨 Nieuwe melding
  </div>

  `;

  initClock();
});

/* ================= USER ================= */
function getUser() {
  return window.firebase?.auth()?.currentUser?.email || "agent@test.nl";
}

/* ================= CLOCK ================= */
// function initClock() {
//   function updateClock() {
//     const now = new Date();

//     const clock = document.getElementById("clock");
//     const date = document.getElementById("date");

//     if (clock) clock.textContent = now.toLocaleTimeString("nl-NL");
//     if (date) date.textContent = now.toLocaleDateString("nl-NL");
//   }

//   updateClock();
//   setInterval(updateClock, 1000);
// }

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