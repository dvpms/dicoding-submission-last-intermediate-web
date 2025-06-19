class AddStoryPresenter {
  constructor({ view, storyModel }) {
    this._view = view;
    this._storyModel = storyModel;
  }

  async submitStory(data) {
    if (!data.description || !data.photo) {
      this._view.showError("Deskripsi dan foto tidak boleh kosong.");
      return;
    }

    try {
      this._view.showLoading();
      const response = await this._storyModel.addNewStory({
        description: data.description,
        photo: data.photo,
        lat: data.lat,
        lon: data.lon,
      });

      // Handle success case
      this._view.hideLoading();
      this._view.showSuccess("Cerita berhasil ditambahkan!");

      setTimeout(() => {
        window.location.href = "/stories";
      }, 2000);
    } catch (error) {
      console.error("Error submitting story in Presenter:", error);
      this._view.hideLoading();
      this._view.showError(
        error.message ||
          "Terjadi kesalahan saat mengirim cerita. Silakan coba lagi."
      );
    }
  }
}

export default AddStoryPresenter;
