// sandbox.js

// TODOO: replace these with your actual firebase config values
const config = {
    apiKey: "AIzaSyBX0HKE3UX5X6S_FZfL9HCGlpUbZB1FHpM",
    authDomain: "chat-e19d1.firebaseapp.com",
    projectId: "chat-e19d1",
    storageBucket: "chat-e19d1.appspot.com",
    messagingSenderId: "343123008556",
    appId: "1:343123008556:web:a55d54202fc5ff45678589",
    measurementId: "G-92B2SGDDJZ"
};

window.addEventListener("message", (event) => {
    if (event.data === "init") {
        const app = firebase.initializeApp(config);

        console.log("Initialized Firebase!", app);
        let auth = firebase.auth();
        console.log("Auth: ", auth);

    }
});