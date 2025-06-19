import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import AuthModel from "./data/auth-model";
import NotificationHelper from "./notification-helper";

function updateNavigationUI() {
  const userToken = AuthModel.getUserToken();
  const userName = AuthModel.getUserName();

  const navLoginLink = document.querySelector("#nav-login");
  const navLogoutLink = document.querySelector("#nav-logout");
  const navAddStoryLink = document.querySelector("#nav-add-story");
  const userGreetingElement = document.querySelector("#userGreeting");
  const logoutButton = document.querySelector("#logoutButton");

  if (userToken) {
    if (navLoginLink) navLoginLink.style.display = "none";
    if (navLogoutLink) navLogoutLink.style.display = "list-item";
    if (navAddStoryLink) navAddStoryLink.style.display = "list-item";
    if (userGreetingElement && userName) {
      userGreetingElement.textContent = `Halo, ${userName}!`;
      userGreetingElement.style.display = "inline";
    }
    if (userGreetingElement && !userName) {
      userGreetingElement.textContent = `Halo, Pengguna!`;
      userGreetingElement.style.display = "inline";
    }

    if (logoutButton) {
      if (!logoutButton.dataset.listenerAttached) {
        logoutButton.addEventListener("click", (event) => {
          event.preventDefault();
          AuthModel.removeUserToken();
          AuthModel.removeUserName();
          updateNavigationUI();
          window.location.hash = "#/login";
        });
        logoutButton.dataset.listenerAttached = "true";
      }
    }
  } else {
    if (navLoginLink) navLoginLink.style.display = "list-item";
    if (navLogoutLink) navLogoutLink.style.display = "none";
    if (navAddStoryLink) navAddStoryLink.style.display = "none";
    if (userGreetingElement) {
      userGreetingElement.textContent = "";
      userGreetingElement.style.display = "none";
    }
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
