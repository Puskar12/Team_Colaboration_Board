import express from "express";
import Board from "../models/Board.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create a board → only managers
// router.post("/", protect, authorize("manager"), async (req, res) => {
//   try {
//     const { name, description, deadline, members } = req.body;
//     const membersArray = members.split(",").map((m) => m.trim());

//     const newBoard = new Board({ name, description, deadline, members: membersArray, status: "active" });
//     await newBoard.save();

//     res.status(201).json(newBoard);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// POST /api/boards
router.post("/", protect, authorize("manager"), async (req, res) => {
  try {
    const { name, description, deadline, members } = req.body;
    const membersArray = (typeof members === "string")
      ? members.split(",").map(m => m.trim())
      : Array.isArray(members) ? members : [];

    const newBoard = await Board.create({
      name,
      description,
      deadline,
      members: membersArray,
      status: "active",    // <-- ensure active
      completed: false     // <-- optional but useful
    });

    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


// Get all boards → any logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update a board → only managers
router.put("/:id", protect, authorize("manager"), async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const { name, description, deadline, members } = req.body;
    if (name) board.name = name;
    if (description) board.description = description;
    if (deadline) board.deadline = deadline;
    if (members) board.members = members;

    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Complete a board → manager or member
// router.put("/:id/complete", protect, authorize(["manager", "member"]), async (req, res) => {
//   try {
//     const board = await Board.findById(req.params.id);
//     if (!board) return res.status(404).json({ message: "Board not found" });

//     board.status = "completed"; // mark as completed
//     await board.save();

//     res.json(board);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });
// PUT /api/boards/:id/complete
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    board.status = "completed";
    board.completed = true; // keep both fields in sync if you use both
    await board.save();

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});



// Delete a board → only managers
router.delete("/:id", protect, authorize("manager"), async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    await board.deleteOne();
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// --- New Routes for Dashboard Counts ---

// Count of active boards
router.get("/count", async (req, res) => {
  try {
    const count = await Board.countDocuments({ status: "active" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Count of completed boards
router.get("/completed/count", async (req, res) => {
  try {
    const count = await Board.countDocuments({ status: "completed" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
