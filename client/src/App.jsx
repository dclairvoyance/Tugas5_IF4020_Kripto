import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import useAuth from "./stores/useAuth";
import useSocket from "./stores/useSocket";

import "./App.css";

function App() {
  const { authUser } = useAuth();
  const { initializeSocket, closeSocket } = useSocket();

  useEffect(() => {
    if (authUser) {
      initializeSocket();
    } else {
      closeSocket();
    }

    return () => {
      closeSocket();
    };
  }, [authUser, closeSocket, initializeSocket]);

  return (
    <div className="flex w-[90vw] h-[90vh] border border-[#1e2930] rounded-md">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={authUser ? <Navigate to="/" /> : <Register />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}

export default App;
