class LoginPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
  }

  async login({ email, password }) {
    if (!email || !password) {
      this._view.showError("Email dan password tidak boleh kosong.");
      return;
    }

    try {
      this._view.showLoading();

      const loginResult = await this._authModel.login({ email, password });

      this._authModel.saveUserToken(loginResult.token);
      this._authModel.saveUserName(loginResult.name);

      this._view.hideLoading();
      this._view.navigateToHome();
    } catch (error) {
      this._view.hideLoading();
      this._view.showError(
        error.message || "Terjadi kesalahan saat mencoba login."
      );
    }
  }
}

export default LoginPresenter;
