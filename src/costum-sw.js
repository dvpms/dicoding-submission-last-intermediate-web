self.addEventListener("push", (event) => {
  console.log("Service Worker: Menerima event push.");

  let notificationData = {};
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: "Notifikasi Baru",
      options: {
        body: event.data.text(),
        icon: "/images/logo.png",
      },
    };
  }

  const { title, options } = notificationData;

  const notificationPromise = self.registration.showNotification(
    title,
    options
  );
  event.waitUntil(notificationPromise);
});
