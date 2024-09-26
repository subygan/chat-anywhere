
// popup.js
import { initializeApp, getAuth, signInWithPopup, GoogleAuthProvider, signOut, getToken as getWebextToken } from 'firebase/auth/web-extension';

const firebaseConfig = {
    // Your web app's Firebase configuration
    // apiKey, authDomain, projectId, etc.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');aimport React, { useState, useEffect } from 'react';

    const Popup: React.FC = () => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        useEffect(() => {
            // Check login status on component mount
            const checkLoginStatus = () => {
                // Implement your login check logic here
            };
            checkLoginStatus();
        }, []);

        const sendFirebaseAuthMessage = () => {
            chrome.runtime.sendMessage({ type: 'FIREBASE_AUTH' }, (response) => {
                if (response.success) {
                    console.log('Firebase Auth successful:', response.auth);
                } else {
                    console.error('Firebase Auth failed:', response.error);
                }
            });
        };

        const handleLogin = () => {
            console.log('Logging in...');
            sendFirebaseAuthMessage();
            setIsLoggedIn(true);
        };

        const handleLogout = () => {
            setIsLoggedIn(false);
        };

        return (
            <div className="w-[300px] bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">YouTube Chat Extension</h1>
                    <p className="mb-4 text-gray-600">Enhance your YouTube experience with AI-powered chat.</p>
                    <div id="loginStatus" className="mb-4 text-sm text-gray-500">
                        {isLoggedIn ? 'Logged in' : 'Not logged in'}
                    </div>
                    {!isLoggedIn ? (
                        <button
                            onClick={handleLogin}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
                        >
                            Log In with Google
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            </div>
        );
    };

    export default Popup;
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
