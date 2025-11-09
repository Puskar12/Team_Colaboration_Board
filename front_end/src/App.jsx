import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Board from "../pages/Board";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Signup from "../pages/signup";
import PrivateRoute from "../components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full bg-gray-50 overflow-x-hidden">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected route */}
          <Route
            path="/board"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
