// src/scripts/pages/auth/templates/register-template.js

const createRegisterTemplate = () => `
  <div class="register-container">
    <h2>Buat Akun Baru</h2>
    <form id="registerForm" class="register-form" aria-labelledby="registerFormHeading">
      <p id="registerFormHeading" class="sr-only">Formulir Pendaftaran Akun Baru</p>
      
      <div class="form-group">
        <label for="registerName">Nama:</label>
        <input type="text" id="registerName" name="name" required autocomplete="name">
      </div>
      
      <div class="form-group">
        <label for="registerEmail">Email:</label>
        <input type="email" id="registerEmail" name="email" required autocomplete="email">
      </div>

      <div class="form-group">
        <label for="registerPassword">Password:</label>
        <input type="password" id="registerPassword" name="password" required minlength="8" autocomplete="new-password">
        <small>Minimal 8 karakter.</small>
      </div>

      <div id="registerErrorMessage" class="error-message" style="display: none;"></div>
      <div id="registerSuccessMessage" class="success-message" style="display: none;"></div>

      <button type="submit" class="button button-primary">Daftar</button>
    </form>
    <p class="login-link">Sudah punya akun? <a href="#/login">Login di sini</a></p>
  </div>
`;

// eslint-disable-next-line import/prefer-default-export
export { createRegisterTemplate };
