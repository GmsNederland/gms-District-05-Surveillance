/* ================= STATE ================= */
let sidebarOpen = false;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  injectTopbar();
  startClock();
});

/* ================= TOPBAR INJECT ================= */
function injectTopbar() {
  const el = document.getElementById("topbar-container");
  if (!el) return;

  el.innerHTML = `
  <div id="overlay" onclick="toggleMenu(false)"></div>

  <div id="sidebar">

    <div class="sidebar-header">
      <div class="logo">D05 GMS</div>
      <div class="sub">Dispatch System</div>
    </div>

    <div class="sidebar-section">

      <div class="section-title">Navigatie</div>

      <a class="nav-item active" href="/src/pages/rolenselect.html">
        <span class="icon">🏠</span> Dashboard
      </a>

      <a class="nav-item" href="/src/pages/panels/meldkamer.html">
        <span class="icon">🚨</span> Meldkamer
      </a>

      <a class="nav-item" href="#">
        <span class="icon">🚓</span> Eenheden
      </a>

      <a class="nav-item" href="/src/pages/accountsettings.html">
        <span class="icon">⚙️</span> Instellingen
      </a>

    </div>

    <div class="sidebar-footer">
      <div class="status-dot online"></div>
      <span>Systeem Online</span>
    </div>

  </div>

  <div id="topbar">

    <div class="left">
      <div class="hamburger" onclick="toggleMenu()">☰</div>
      <strong>D05·GMS</strong>

      <div class="conn online">API</div>
      <div class="conn offline">RBLX</div>
      <div class="conn warn">RTDB</div>
    </div>

    <div class="center"></div>

    <div class="right">

      <div class="datetime">
        <div id="date"></div>
        <div id="clock"></div>
      </div>

      <div class="notifBox" onclick="toggleNotifications(event)">
        🔔
        <span class="notifDot"></span>
      </div>

      <div class="userBox" onclick="toggleUserMenu(event)">
        👤 ${getUser()}
        <div id="userMenu" class="userMenu">
          <div class="menu-item settings" onclick="openprofile()">👤 Profiel</div>
          <div class="menu-item settings" onclick="settingsopen()">⚙️ Instellingen</div>
          <div class="menu-item danger" onclick="openLogout()">🚪 Uitloggen</div>
        </div>
      </div>

    </div>

  </div>

  <div id="logoutModal" class="modal hidden">
    <div class="modal-box">
      <h3>Uitloggen bevestigen</h3>
      <p>Weet je zeker dat je wilt uitloggen?</p>

      <div class="modal-actions">
        <button class="btn cancel" onclick="closeLogout()">Annuleren</button>
        <button class="btn danger" onclick="logout()">Uitloggen</button>
      </div>
    </div>
  </div>

  <div id="notifPanel" class="notifPanel">
    <div class="notifHeader">
      <h3>Meldingen</h3>
      <span onclick="toggleNotifications()" class="close">✖</span>
    </div>

    <div class="notifList">
      <div class="notifItem">🚨 Nieuwe melding <span>nu</span></div>
    </div>
  </div>
  `;
}

/* ================= USER ================= */
function getUser() {
  return window.firebase?.auth()?.currentUser?.email || "agent@test.nl";
}

/* ================= CLOCK ================= */
function startClock() {
  function update() {
    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (clock) clock.textContent = now.toLocaleTimeString("nl-NL");
    if (date) date.textContent = now.toLocaleDateString("nl-NL");
  }

  update();
  setInterval(update, 1000);
}

/* ================= SIDEBAR ================= */
window.toggleMenu = function (force = null) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !overlay) return;

  sidebarOpen = force !== null ? force : !sidebarOpen;

  sidebar.classList.toggle("open", sidebarOpen);
  overlay.classList.toggle("active", sidebarOpen);
};

/* ================= USER MENU ================= */
window.toggleUserMenu = function (e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("userMenu");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
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
  window.location.href = "/";
};

/* ================= CLOSE OUTSIDE ================= */
document.addEventListener("click", () => {
  document.getElementById("userMenu")?.style &&
    (document.getElementById("userMenu").style.display = "none");

  document.getElementById("notifPanel")?.classList?.remove("show");
});

/* ================= ESC ================= */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  toggleMenu(false);

  document.getElementById("userMenu")?.style &&
    (document.getElementById("userMenu").style.display = "none");

  document.getElementById("notifPanel")?.classList?.remove("show");
});