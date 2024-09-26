import React, {useState, useEffect} from 'react';
import {useFirebase} from "../fb/hook";

const Popup: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {isLoading, user, firestore, onLogin, onLogout} = useFirebase();


  return (
    <div className="w-[300px] bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">YouTube Chat Extension</h1>
        <p className="mb-4 text-gray-600">Enhance your YouTube experience with AI-powered chat.</p>
        <div id="loginStatus" className="mb-4 text-sm text-gray-500">
          {isLoggedIn ? 'Logged in' : 'Not logged in'}
        </div>


          {isLoading ? "Loading..." : ""}
          {!!user ? (
            <p className="mb-4 text-gray-600">
              Welcome, {user.displayName} your email address is{" "} {user.email}
            </p>
          ) : (
            "not working?"
          )}
        {!user ? (
          <button
            onClick={onLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Log In with Google
          </button>
        ) : (
          <button
            onClick={onLogout}
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
