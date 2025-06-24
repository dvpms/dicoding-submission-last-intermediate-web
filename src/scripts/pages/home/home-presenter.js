import AuthModel from "../../data/auth-model";
import StoryModel from "../../data/story-model";
import StoryDbHelper from "../../data/db-helper";

class HomePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async initializePage() {
    const userToken = AuthModel.getUserToken();
    if (!userToken) {
      this._view.redirectToLogin();
      return;
    }

    await this._loadStories();
  }

  async _loadStories() {
    try {
      this._view.showLoading();
      const storiesFromNetwork = await StoryModel.getAllStories();
      this._view.displayStories(storiesFromNetwork);
    } catch (error) {
      console.log(
        "Gagal mengambil dari jaringan. Menampilkan cerita yang tersimpan offline."
      );
      try {
        const storiesFromDb = await StoryDbHelper.getAllStories();
        if (storiesFromDb && storiesFromDb.length > 0) {
          this._view.displayStories(storiesFromDb);
        } else {
          this._view.showError(
            "Anda sedang offline dan belum ada cerita yang disimpan."
          );
        }
      } catch (dbError) {
        this._view.showError("Gagal mengakses data offline.");
      }
    } finally {
      this._view.hideLoading();
    }
  }
}

export default HomePresenter;
