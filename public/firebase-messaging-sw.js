importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAlt9MamcsaRVdcVm6DzKnbPBy04Lx8F-M",
    authDomain: "nova-577bb.firebaseapp.com",
    projectId: "nova-577bb",
    storageBucket: "nova-577bb.appspot.com",
    messagingSenderId: "1029261034194",
    appId: "1:1029261034194:web:b39a3a50687ece9f61a30b",
    measurementId: "G-WBN29SL961"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
});  