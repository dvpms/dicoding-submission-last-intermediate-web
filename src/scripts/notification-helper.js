// src/scripts/utils/notification-helper.js (Versi Debug)
import AuthModel from "./data/auth-model";

// Fungsi urlBase64ToUint8Array (tidak berubah)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationHelper = {
  async setup() {
    console.log("Memulai setup notifikasi...");

    if (!("PushManager" in window)) {
      console.warn("Push Messaging tidak didukung oleh browser ini.");
      return;
    }

    try {
      console.log("Langkah 1: Menunggu service worker siap (ready)...");
      const registration = await navigator.serviceWorker.ready;
      console.log(
        "Langkah 2: Service worker siap. Registration object:",
        registration
      );

      console.log("Langkah 3: Mengecek subscription yang sudah ada...");
      const existingSubscription =
        await registration.pushManager.getSubscription();
      console.log(
        "Langkah 4: Hasil pengecekan subscription:",
        existingSubscription
      );

      if (existingSubscription) {
        console.log("Pengguna sudah subscribe. Proses selesai.");
        alert("Anda sudah berlangganan notifikasi.");
        return;
      }

      console.log(
        "Langkah 5: Tidak ada subscription, memulai proses subscribe baru..."
      );
      await this.subscribe(registration);
    } catch (error) {
      console.error("Gagal total saat setup notifikasi:", error);
      alert(`Terjadi error saat setup notifikasi: ${error.message}`);
    }
  },

  async subscribe(registration) {
    console.log("Langkah 6: Meminta izin notifikasi kepada pengguna...");
    const permission = await Notification.requestPermission();
    console.log(`Langkah 7: Izin diberikan: ${permission}`);

    if (permission !== "granted") {
      console.log("Izin notifikasi tidak diberikan oleh pengguna.");
      return;
    }

    const VAPID_PUBLIC_KEY =
      "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    try {
      console.log("Langkah 8: Melakukan subscribe dengan pushManager...");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      console.log("Langkah 9: Berhasil subscribe di browser:", subscription);

      console.log("Langkah 10: Mengirim data subscription ke server...");
      await AuthModel.subscribePushNotification(subscription);
      console.log("Langkah 11: Data subscription berhasil dikirim ke server.");
      alert("Anda berhasil subscribe notifikasi!");
    } catch (error) {
      console.error("Gagal pada proses subscribe atau kirim ke server:", error);
      alert(`Gagal subscribe notifikasi: ${error.message}`);
    }
  },
};

export default NotificationHelper;
