// popup.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { initializeAppCheck, getToken } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check.js';
import { getToken as getWebextToken } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth/web-extension.js';

const firebaseConfig = {
    // Your web app's Firebase configuration
    // apiKey, authDomain, projectId, etc.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginStatus = document.getElementById('loginStatus');

    auth.onAuthStateChanged(function(user) {
        if (user) {
            loginStatus.textContent = `Logged in as ${user.email}`;
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginStatus.textContent = 'Not logged in';
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    });

    loginBtn.addEventListener('click', function() {
        const provider = new GoogleAuthProvider();
        getWebextToken(auth).then((webextToken) => {
            return signInWithPopup(auth, provider);
        }).then((result) => {
            console.log("User signed in:", result.user);
        }).catch((error) => {
            console.error("Error during sign in:", error);
        });
    });

    logoutBtn.addEventListener('click', function() {
        signOut(auth).then(() => {
            console.log("User signed out");
        }).catch((error) => {
            console.error("Error during sign out:", error);
        });
    });
});