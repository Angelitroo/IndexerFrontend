importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCMN5St4lN6NN2av6RQMYk8DChcEoARTE4",
  authDomain: "indexer-1c043.firebaseapp.com",
  projectId: "indexer-1c043",
  storageBucket: "indexer-1c043.appspot.com",
  messagingSenderId: "7920428745",
  appId: "1:7920428745:web:e472a6b0a5384f58b88f18",
  measurementId: "G-8C07TDSPZ8"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/assets/indexer.png',
    data: {
      url: payload.data.link || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);

  event.notification.close();

  const urlToOpen = event.notification.data.url;

  if (urlToOpen) {
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});
