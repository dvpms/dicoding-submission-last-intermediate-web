import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import AuthModel from "./data/auth-model";
import NotificationHelper from "./notification-helper";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Override ikon default Leaflet dengan gambar yang sudah diimpor
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function updateNavigationUI() {
  const userToken = AuthModel.getUserToken();
  const userName = AuthModel.getUserName();

  const navLoginLink = document.querySelector("#nav-login");
  const navLogoutLink = document.querySelector("#nav-logout");
  const navAddStoryLink = document.querySelector("#nav-add-story");
  const userGreetingElement = document.querySelector("#userGreeting");
  const logoutButton = document.querySelector("#logoutButton");
  const navSavedLink = document.querySelector("#nav-saved");

  // Pastikan semua elemen ditemukan sebelum mencoba mengubahnya
  if (navLoginLink && navLogoutLink && navAddStoryLink && userGreetingElement) {
    if (userToken) {
      // --- JIKA PENGGUNA LOGIN ---
      navLoginLink.style.display = "none";
      navLogoutLink.style.display = "list-item";
      navAddStoryLink.style.display = "list-item";
      navSavedLink.style.display = "list-item";

      userGreetingElement.textContent = `Halo, ${userName || "Pengguna"}!`;
      userGreetingElement.style.display = "inline";

      if (logoutButton && !logoutButton.dataset.listenerAttached) {
        logoutButton.addEventListener("click", (event) => {
          event.preventDefault();
          AuthModel.removeUserToken();
          AuthModel.removeUserName();
          updateNavigationUI();
          window.location.hash = "#/login";
        });
        logoutButton.dataset.listenerAttached = "true";
      }
    } else {
      // --- JIKA PENGGUNA TIDAK LOGIN ---
      navLoginLink.style.display = "list-item";
      navLogoutLink.style.display = "none";
      navAddStoryLink.style.display = "none";
      navSavedLink.style.display = "none";

      userGreetingElement.textContent = "";
      userGreetingElement.style.display = "none";
    }
  } else {
    console.error("Satu atau lebih elemen navigasi tidak ditemukan di DOM.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  updateNavigationUI();

  await app.renderPage();
  const notificationButton = document.querySelector("#notificationButton");
  if (notificationButton) {
    notificationButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      console.log("Tombol notifikasi diklik.");
      await NotificationHelper.setup();
    });
  }

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    updateNavigationUI();
  });
});
