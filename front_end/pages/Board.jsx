import React, { useState, useEffect } from "react";
import CreateBoard from "../components/CreateBoard";
import axios from "axios";
import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBoard, setEditBoard] = useState(null);

  // 🔹 Fetch all boards (public)
  useEffect(() => {
    const fetchBoards = async () => {
      try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/boards", {
        headers: { Authorization: `Bearer ${token}` }
      });
        if (Array.isArray(data)) {
          setBoards(data.filter((b) => b.status === "active"));
        } else {
          console.error("Invalid data format from server", data);
        }
      } catch (error) {
        console.error("Error fetching boards:", error.response?.data || error.message);
      }
    };

    fetchBoards();
  }, []);

  // 🔹 Add new board to state
  const handleCreateBoard = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
  };

  // 🔹 Update board in state after editing
  const handleUpdateBoard = (updatedBoard) => {
    setBoards((prev) => prev.map((b) => (b._id === updatedBoard._id ? updatedBoard : b)));
  };

  // 🔹 Delete board (protected)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete boards");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting board:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete board");
    }
  };

  // 🔹 Complete board (protected)
  const handleComplete = async (id) => {
    if (!window.confirm("Mark this board as completed?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to complete boards");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/boards/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error completing board:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to complete board");
    }
  };

  return (
    <div className="p-6 min-h-[calc(100vh-72px)] w-full bg-gray-50 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">Boards</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Create Board
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.length > 0 ? (
          boards.map((board) => (
            <div
              key={board._id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{board.name}</h2>
              <p className="text-gray-600 text-sm mb-3">{board.description}</p>
              <p className="text-sm text-gray-500 mb-3">
                📅 {board.deadline ? new Date(board.deadline).toLocaleDateString() : "No deadline"}
              </p>

              <div className="flex flex-wrap mb-3">
                {board.members?.map((member, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 m-1 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {member}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditBoard(board);
                    setShowForm(true);
                  }}
                  className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleComplete(board._id)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleDelete(board._id)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No boards available.</p>
        )}
      </div>

      {showForm && (
        <CreateBoard
          onClose={() => {
            setShowForm(false);
            setEditBoard(null);
          }}
          onCreate={handleCreateBoard}
          existingBoard={editBoard}
          onUpdate={handleUpdateBoard}
        />
      )}
    </div>
  );
};

export default Board;
