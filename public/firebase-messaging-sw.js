importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDdCzvhm00Tr1JuanWnAdbiAOmX91mkrNA",
    authDomain: "ohrey-5014e.firebaseapp.com",
    projectId: "ohrey-5014e",
    storageBucket: "ohrey-5014e.appspot.com",
    messagingSenderId: "903825059301",
    appId: "1:903825059301:web:1292bbb7e70a9636c1d30c",
    measurementId: "G-V7GJMNGBKQ"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body:  payload.notification.body,
      icon: 'https://qmanage.ohrey.vn/images/favicon.png',
      data: payload.data,
      actions: [
        {
            action: 'view',
            title: 'View'
        }
      ]
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const { data = {} } = event.notification

    if(data.url) {
        clients.openWindow(`/${data.url}`)
    } else {
        clients.openWindow('/');
    }
    
}, false);