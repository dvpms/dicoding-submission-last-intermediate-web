import AuthModel from "./data/auth-model";

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
    if (!("PushManager" in window)) {
      console.warn("Push Messaging tidak didukung oleh browser ini.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        console.log("Pengguna sudah subscribe.", existingSubscription);
        return;
      }

      await this.subscribe(registration);
    } catch (error) {
      console.error("Gagal setup notifikasi:", error);
    }
  },

  async subscribe(registration) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Izin notifikasi tidak diberikan.");
      return;
    }

    const VAPID_PUBLIC_KEY =
      "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log("Berhasil subscribe:", subscription);
      await AuthModel.subscribePushNotification(subscription);
      alert("Anda berhasil subscribe notifikasi!");
      console.log("Data subscription berhasil dikirim ke server.");
    } catch (error) {
      console.error("Gagal subscribe:", error);
      alert("Gagal subscribe notifikasi. Silakan coba lagi.");
    }
  },
};

export default NotificationHelper;
