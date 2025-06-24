// scripts/data/auth-model.js
import CONFIG from "../config";

const AuthModel = {
  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    if (!responseJson.loginResult || !responseJson.loginResult.token) {
      throw new Error("Login failed: No token received.");
    }

    return responseJson.loginResult;
  },
  async register({ name, email, password }) {
    const response = await fetch(
      `${CONFIG.BASE_URL}${CONFIG.REGISTER_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  },
  async subscribePushNotification(subscription) {
    const token = this.getUserToken();
    if (!token) {
      throw new Error("Anda harus login untuk berlangganan notifikasi.");
    }
    const subscriptionJson = subscription.toJSON();
    const payload = {
      endpoint: subscriptionJson.endpoint,
      keys: {
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
      },
    };

    const response = await fetch(
      `${CONFIG.BASE_URL}${CONFIG.SUBSCRIBE_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  },

  async unsubscribePushNotification(endpoint) {
    const token = this.getUserToken();
    if (!token) {
      throw new Error(
        "Anda harus login untuk berhenti berlangganan notifikasi."
      );
    }

    const response = await fetch(
      `${CONFIG.BASE_URL}${CONFIG.SUBSCRIBE_ENDPOINT}`,
      {
        method: "DELETE", // Menggunakan metode DELETE
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }), // Kirim endpoint sesuai dokumentasi
      }
    );

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  },

  saveUserToken(token) {
    localStorage.setItem("userToken", token);
  },

  getUserToken() {
    return localStorage.getItem("userToken");
  },

  removeUserToken() {
    localStorage.removeItem("userToken");
  },

  saveUserName(name) {
    localStorage.setItem("userName", name);
  },

  getUserName() {
    return localStorage.getItem("userName");
  },
};

export default AuthModel;
