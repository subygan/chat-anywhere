const firebaseConfig = {

};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // You can perform actions here when the user is signed in
    } else {
        console.log('User is signed out');
        // You can perform actions here when the user is signed out
    }
});
// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendToLLM') {
        // Here you would typically send the message to your LLM service
        // For this example, we'll just simulate a response
        simulateLLMResponse(request.message, request.videoInfo)
            .then(answer => sendResponse({ answer: answer }))
            .catch(error => sendResponse({ error: error.message }));

        return true; // Indicates that the response is asynchronous
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'login') {
        // Perform login authentication here
        // This is a placeholder for actual authentication logic
        const username = request.username;
        const password = request.password;

        // Simulating an API call
        setTimeout(() => {
            const success = true; // Replace with actual authentication result
            if (success) {
                chrome.storage.sync.set({loggedIn: true, username: username}, function() {
                    sendResponse({success: true});
                });
            } else {
                sendResponse({success: false, error: 'Invalid credentials'});
            }
        }, 1000);

        return true; // Indicates that the response is sent asynchronously
    }
});

async function simulateLLMResponse(message, videoInfo) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a simple response based on the input
    const response = `Regarding the video "${videoInfo.title}" (ID: ${videoInfo.id}), you asked: "${message}". Here's a simulated AI response.`;

    return response;
}

// In a real implementation, you would replace simulateLLMResponse with an actual API call to your LLM service

// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
