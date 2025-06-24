import CONFIG from "../config";
import AuthModel from "./auth-model";
import StoryDbHelper from "./db-helper";

const StoryModel = {
  async getAllStories() {
    const token = AuthModel.getUserToken();
    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    try {
      const response = await fetch(
        `${CONFIG.BASE_URL}${CONFIG.GET_ALL_STORIES_ENDPOINT}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson = await response.json();

      if (responseJson.error) {
        if (
          responseJson.message === "Token is invalid" ||
          responseJson.message === "Token aledy expired"
        ) {
          AuthModel.removeUserToken();
          window.location.hash = "#/login";
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw new Error(responseJson.message || "Gagal mengambil data cerita.");
      }

      if (!responseJson.listStory) {
        throw new Error("Data cerita tidak ditemukan dalam respons API.");
      }

      // await StoryDbHelper.putAllStories(responseJson.listStory);
      // console.log("Cerita dari API berhasil disimpan ke IndexedDB.");

      return responseJson.listStory;
    } catch (error) {
      console.error("Gagal mengambil cerita dari jaringan:", error.message);
      throw new Error(error.message || "Tidak dapat terhubung ke jaringan.");
    }
  },

  async addNewStory({ description, photo, lat, lon }) {
    const token = AuthModel.getUserToken();
    if (!token) {
      throw new Error(
        "Autentikasi gagal: Token tidak ditemukan. Silakan login kembali."
      );
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== null && lat !== undefined && !isNaN(parseFloat(lat))) {
      formData.append("lat", parseFloat(lat));
    }
    if (lon !== null && lon !== undefined && !isNaN(parseFloat(lon))) {
      formData.append("lon", parseFloat(lon));
    }

    try {
      const response = await fetch(
        `${CONFIG.BASE_URL}${CONFIG.ADD_NEW_STORY_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(
        "Network error or invalid JSON response when adding new story:",
        error
      );
      return {
        error: true,
        message: error.message || "Gagal terhubung ke server.",
      };
    }
  },
};

export default StoryModel;
