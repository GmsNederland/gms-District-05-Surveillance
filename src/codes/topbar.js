export function initTopbar() {
  /* ================= ELEMENTS ================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const hamburger = document.querySelector(".hamburger");

  const userBox = document.querySelector(".userBox");
  const userMenu = document.getElementById("userMenu");

  const notifBox = document.querySelector(".notifBox");
  const notifPanel = document.getElementById("notifPanel");

  const logoutModal = document.getElementById("logoutModal");
  const logoutCancelBtn = logoutModal?.querySelector(".btn.cancel");
  const logoutConfirmBtn = logoutModal?.querySelector(".btn.danger");

  let sidebarOpen = false;
  let userMenuOpen = false;
  let notifOpen = false;

  /* ================= CLOCK ================= */
  function updateClock() {
    const now = new Date();

    const clockEl = document.getElementById("clock");
    const dateEl = document.getElementById("date");

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("nl-NL");
    }

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString("nl-NL");
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  /* ================= SIDEBAR ================= */
  function toggleSidebar(force = null) {
    if (!sidebar || !overlay) return;

    sidebarOpen = force !== null ? force : !sidebarOpen;

    sidebar.classList.toggle("open", sidebarOpen);
    overlay.classList.toggle("active", sidebarOpen);
  }

  hamburger?.addEventListener("click", () => toggleSidebar());
  overlay?.addEventListener("click", () => toggleSidebar(false));

  /* ================= USER MENU ================= */
  function toggleUserMenu() {
    if (!userMenu) return;

    userMenuOpen = !userMenuOpen;
    userMenu.style.display = userMenuOpen ? "block" : "none";
  }

  userBox?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleUserMenu();
  });

  /* ================= NOTIFICATIONS ================= */
  function toggleNotifications() {
    if (!notifPanel) return;

    notifOpen = !notifOpen;
    notifPanel.style.display = notifOpen ? "block" : "none";
  }

  notifBox?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNotifications();
  });

  /* ================= LOGOUT MODAL ================= */
  function openLogout() {
    if (!logoutModal) return;
    logoutModal.classList.remove("hidden");
  }

  function closeLogout() {
    if (!logoutModal) return;
    logoutModal.classList.add("hidden");
  }

  logoutCancelBtn?.addEventListener("click", closeLogout);

  logoutConfirmBtn?.addEventListener("click", () => {
    // hier later echte logout logica
    console.log("User logged out");
    closeLogout();
  });

  /* ================= GLOBAL CLOSE HANDLERS ================= */
  document.addEventListener("click", () => {
    if (userMenu) userMenu.style.display = "none";
    if (notifPanel) notifPanel.style.display = "none";

    userMenuOpen = false;
    notifOpen = false;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleSidebar(false);
      closeLogout();

      if (userMenu) userMenu.style.display = "none";
      if (notifPanel) notifPanel.style.display = "none";

      userMenuOpen = false;
      notifOpen = false;
    }
  });

  /* ================= EXPOSE IF NEEDED ================= */
  return {
    toggleSidebar,
    openLogout,
    closeLogout
  };
}
initTopbar();