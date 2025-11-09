import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      {/* Left side - App name */}
      <h1
        className="text-2xl font-semibold text-gray-800 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Team Collaboration Board
      </h1>

      {/* Right side - Links */}
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className={`text-gray-700 font-medium hover:text-blue-600 transition ${
            location.pathname === "/" ? "text-blue-600" : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/board"
          className={`text-gray-700 font-medium hover:text-blue-600 transition ${
            location.pathname === "/board" ? "text-blue-600" : ""
          }`}
        >
          Boards
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className={`text-gray-700 font-medium hover:text-blue-600 transition ${
                location.pathname === "/login" ? "text-blue-600" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`text-gray-700 font-medium hover:text-blue-600 transition ${
                location.pathname === "/signup" ? "text-blue-600" : ""
              }`}
            >
              Sign Up
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="text-gray-700 font-medium">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
