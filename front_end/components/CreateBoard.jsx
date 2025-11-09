import React, { useState } from "react";
import "./CreateBoard.css";

const CreateBoard = ({ onClose, onCreate, existingBoard, onUpdate }) => {
  const [title, setTitle] = useState(existingBoard ? existingBoard.name : "");
  const [description, setDescription] = useState(existingBoard ? existingBoard.description : "");
  const [deadline, setDeadline] = useState(existingBoard ? existingBoard.deadline?.split("T")[0] : "");
  const [members, setMembers] = useState(existingBoard ? existingBoard.members.join(", ") : "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    const boardData = {
      name: title,
      description,
      deadline,
      members,
    };

    try {
      console.log("in createboard", existingBoard)
      const url = existingBoard
        ? `http://localhost:5000/api/boards/${existingBoard._id}`
        : "http://localhost:5000/api/boards"; // ✅ FIXED URL
      const method = existingBoard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(boardData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save board");
      }

      if (existingBoard) {
        onUpdate(data);
      } else {
        onCreate(data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving board:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {existingBoard ? "Edit Board" : "Create New Board"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Board Title"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <textarea
            placeholder="Enter members name in this format 'X, Y, Z'"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {existingBoard ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoard;
