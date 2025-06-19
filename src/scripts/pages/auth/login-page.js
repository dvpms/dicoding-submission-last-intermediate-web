import AuthModel from "../../data/auth-model";
import LoginPresenter from "./login-presenter";
import { createLoginTemplate } from "./templates/login-template";

class LoginPage {
  async render() {
    return `
      <div id="login-page" class="login-page">
        ${createLoginTemplate()}
      </div>
    `;
  }

  async afterRender() {
    const presenter = new LoginPresenter({
      view: this,
      authModel: AuthModel,
    });

    const loginForm = document.querySelector("#loginForm");
    this.loginContainer = document.querySelector(".login-container");

    if (loginForm && this.loginContainer) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const emailInput = document.querySelector("#email");
        const passwordInput = document.querySelector("#password");
        const email = emailInput.value;
        const password = passwordInput.value;
        await presenter.login({ email, password });
      });
    } else {
      if (!loginForm) console.error("Login form (#loginForm) not found!");
      if (!this.loginContainer)
        console.error("Login container (.login-container) not found!");
    }
    document.querySelector("#email")?.focus();
  }

  showLoading() {
    const submitButton = document.querySelector(
      '#loginForm button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "Memproses...";
    }
    const errorElement = document.querySelector("#loginErrorAlert");
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  hideLoading() {
    const submitButton = document.querySelector(
      '#loginForm button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = "Login";
    }
  }

  showError(message) {
    const containerForError = this.loginContainer;
    if (!containerForError) {
      console.error(
        "Cannot show error: .login-container not found in this.loginContainer."
      );
      return;
    }

    let errorElement = containerForError.querySelector("#loginErrorAlert");

    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.id = "loginErrorAlert";
      const firstChildElement =
        containerForError.querySelector("h2") ||
        containerForError.querySelector("form");
      if (firstChildElement) {
        containerForError.insertBefore(errorElement, firstChildElement);
      } else {
        containerForError.appendChild(errorElement);
      }
    }
    errorElement.textContent = `Login Gagal: ${message}`;
    errorElement.style.display = "block";
  }

  navigateToHome() {
    if (this.loginContainer) {
      const errorElement =
        this.loginContainer.querySelector("#loginErrorAlert");
      if (errorElement) {
        errorElement.style.display = "none";
      }
    }
    window.location.hash = "#/";
  }
}

export default LoginPage;