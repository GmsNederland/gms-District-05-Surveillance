// export function initTopbar() {
//   /* ================= ELEMENTS ================= */
//   const sidebar = document.getElementById("sidebar");
//   const overlay = document.getElementById("overlay");
//   const hamburger = document.querySelector(".hamburger");

//   const userBox = document.querySelector(".userBox");
//   const userMenu = document.getElementById("userMenu");

//   const notifBox = document.querySelector(".notifBox");
//   const notifPanel = document.getElementById("notifPanel");

//   const logoutModal = document.getElementById("logoutModal");
//   const logoutCancelBtn = logoutModal?.querySelector(".btn.cancel");
//   const logoutConfirmBtn = logoutModal?.querySelector(".btn.danger");

//   /* ================= STATE ================= */
//   let sidebarOpen = false;
//   let userMenuOpen = false;
//   let notifOpen = false;

//   /* ================= CLOCK ================= */
//   function updateClock() {
//     const now = new Date();

//     const clockEl = document.getElementById("clock");
//     const dateEl = document.getElementById("date");

//     if (clockEl) clockEl.textContent = now.toLocaleTimeString("nl-NL");
//     if (dateEl) dateEl.textContent = now.toLocaleDateString("nl-NL");
//   }

//   updateClock();
//   const clockInterval = setInterval(updateClock, 1000);

//   /* ================= SIDEBAR ================= */
//   function setSidebar(state) {
//     if (!sidebar || !overlay) return;

//     sidebarOpen = state;
//     sidebar.classList.toggle("open", sidebarOpen);
//     overlay.classList.toggle("active", sidebarOpen);
//   }

//   hamburger?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     setSidebar(!sidebarOpen);
//   });

//   overlay?.addEventListener("click", () => {
//     setSidebar(false);
//     setUserMenu(false);
//     setNotifications(false);
//   });

//   /* ================= USER MENU ================= */
//   function setUserMenu(state) {
//     if (!userMenu) return;

//     userMenuOpen = state;

//     // fallback: werkt altijd, ook zonder CSS
//     userMenu.style.display = userMenuOpen ? "block" : "none";
//   }

//   userBox?.addEventListener("click", (e) => {
//     e.stopPropagation();

//     setNotifications(false);
//     setUserMenu(!userMenuOpen);
//   });

//   // voorkomt sluiten bij klikken IN menu
//   userMenu?.addEventListener("click", (e) => {
//     e.stopPropagation();
//   });

//   /* ================= NOTIFICATIONS ================= */
//   function setNotifications(state) {
//     if (!notifPanel) return;

//     notifOpen = state;

//     // dubbele zekerheid: class + fallback
//     notifPanel.classList.toggle("open", notifOpen);
//     notifPanel.style.display = notifOpen ? "block" : "none";
//   }

//   notifBox?.addEventListener("click", (e) => {
//     e.stopPropagation();

//     setUserMenu(false);
//     setNotifications(!notifOpen);
//   });

//   // voorkomt sluiten bij klikken IN panel
//   notifPanel?.addEventListener("click", (e) => {
//     e.stopPropagation();
//   });

//   /* ================= LOGOUT MODAL ================= */
//   function openLogout() {
//     logoutModal?.classList.remove("hidden");
//   }

//   function closeLogout() {
//     logoutModal?.classList.add("hidden");
//   }

//   logoutCancelBtn?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     closeLogout();
//   });

//   logoutConfirmBtn?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     console.log("User logged out");
//     closeLogout();
//   });

//   logoutModal?.addEventListener("click", (e) => {
//     e.stopPropagation();
//   });

//   /* ================= GLOBAL CLOSE ================= */
//   document.addEventListener("click", () => {
//     setUserMenu(false);
//     setNotifications(false);
//   });

//   document.addEventListener("keydown", (e) => {
//     if (e.key !== "Escape") return;

//     setSidebar(false);
//     setUserMenu(false);
//     setNotifications(false);
//     closeLogout();
//   });

//   /* ================= PUBLIC API ================= */
//   return {
//     toggleSidebar: () => setSidebar(!sidebarOpen),
//     openLogout,
//     closeLogout,
//     setSidebar,
//     setUserMenu,
//     setNotifications,
//     destroy() {
//       clearInterval(clockInterval);
//     }
//   };
// }

// /* ================= AUTO INIT ================= */
// initTopbar();