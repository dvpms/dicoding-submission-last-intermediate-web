const createLoginTemplate = () => `
  <div class="login-container">
    <h2>Login Pengguna</h2>
    <form id="loginForm" class="login-form" aria-labelledby="loginFormHeading">
      <p id="loginFormHeading" class="sr-only">Formulir Login Pengguna</p>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit" class="button button-primary"><i class="fas fa-sign-in-alt"></i> Login</button>
    </form>
    <p class="register-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
  </div>
`;


export { createLoginTemplate };
