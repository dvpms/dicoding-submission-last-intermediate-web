// src/scripts/pages/auth/register-presenter.js
class RegisterPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
  }

  async register({ name, email, password }) {
    // Validasi input dasar
    if (!name || !email || !password) {
      this._view.showError("Nama, email, dan password tidak boleh kosong.");
      return;
    }
    if (password.length < 8) {
      this._view.showError("Password harus memiliki minimal 8 karakter.");
      return;
    }

    try {
      this._view.showLoading();
      const response = await this._authModel.register({
        name,
        email,
        password,
      });
      this._view.hideLoading();
      this._view.showSuccess(
        response.message ||
          "Akun berhasil dibuat! Anda akan diarahkan ke halaman login."
      );
    } catch (error) {
      this._view.hideLoading();
      this._view.showError(
        error.message || "Terjadi kesalahan saat mendaftar."
      );
    }
  }
}

export default RegisterPresenter;
