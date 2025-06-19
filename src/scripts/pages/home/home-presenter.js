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
        "Gagal mengambil dari jaringan, mencoba mengambil dari IndexedDB..."
      );
      try {
        const storiesFromDb = await StoryDbHelper.getAllStories();
        if (storiesFromDb && storiesFromDb.length > 0) {
          console.log("Berhasil mengambil cerita dari IndexedDB.");
          this._view.displayStories(storiesFromDb);
        } else {
          console.log("IndexedDB juga kosong.");
          this._view.showError(
            error.message || "Data tidak dapat dimuat, periksa koneksi Anda."
          );
        }
      } catch (dbError) {
        console.error("Gagal mengambil dari IndexedDB:", dbError);
        this._view.showError(error.message || "Data tidak dapat dimuat.");
      }
    } finally {
      this._view.hideLoading();
    }
  }
}

export default HomePresenter;
