// src/scripts/pages/auth/register-page.js
import AuthModel from "../../data/auth-model";
import RegisterPresenter from "./register-presenter";
import { createRegisterTemplate } from "./templates/register-template";

class RegisterPage {
  async render() {
    return `
      <div id="register-page" class="register-page">
        ${createRegisterTemplate()}
      </div>
    `;
  }

  async afterRender() {
    const presenter = new RegisterPresenter({
      view: this,
      authModel: AuthModel,
    });

    const registerForm = document.querySelector("#registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput = document.querySelector("#registerName");
        const emailInput = document.querySelector("#registerEmail");
        const passwordInput = document.querySelector("#registerPassword");

        await presenter.register({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        });
      });
    }

    document.querySelector("#registerName")?.focus();
  }

  showLoading() {
    const submitButton = document.querySelector(
      '#registerForm button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "Memproses...";
    }
    // Sembunyikan pesan error/sukses saat loading
    const errorElement = document.querySelector("#registerErrorMessage");
    const successElement = document.querySelector("#registerSuccessMessage");
    if (errorElement) errorElement.style.display = "none";
    if (successElement) successElement.style.display = "none";
  }

  hideLoading() {
    const submitButton = document.querySelector(
      '#registerForm button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = "Daftar";
    }
  }

  showSuccess(message) {
    const successElement = document.querySelector("#registerSuccessMessage");
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = "block";
    }
    // Arahkan ke halaman login setelah 2 detik
    setTimeout(() => {
      window.location.hash = "#/login";
    }, 2000);
  }

  showError(message) {
    const errorElement = document.querySelector("#registerErrorMessage");
    if (errorElement) {
      errorElement.textContent = `Registrasi Gagal: ${message}`;
      errorElement.style.display = "block";
    }
  }
}

export default RegisterPage;
