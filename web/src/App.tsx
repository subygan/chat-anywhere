import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { signInWithPopup, GoogleAuthProvider, getAuth } from'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from "./firebaseConfig.js";

function App() {
  console.log("page loaded")
  const [count, setCount] = useState(0)
    const fb_app = initializeApp(firebaseConfig);
    const auth = getAuth();
    // This code runs inside of an iframe in the extension's offscreen document.
    // This gives you a reference to the parent frame, i.e. the offscreen document.
    // You will need this to assign the targetOrigin for postMessage.
    const PARENT_FRAME = document.location.ancestorOrigins[0];

    // This demo uses the Google auth provider, but any supported provider works.
    // Make sure that you enable any provider you want to use in the Firebase Console.
    // https://console.firebase.google.com/project/_/authentication/providers
    const PROVIDER = new GoogleAuthProvider();

    function sendResponse(result) {
        globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME);
    }

    globalThis.addEventListener('message', function({data}) {
        if (data.initAuth) {
            // Opens the Google sign-in page in a popup, inside of an iframe in the
            // extension's offscreen document.
            // To centralize logic, all respones are forwarded to the parent frame,
            // which goes on to forward them to the extension's service worker.
            signInWithPopup(auth, PROVIDER)
                .then(sendResponse)
                .catch(sendResponse)
        }
    });


    return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
