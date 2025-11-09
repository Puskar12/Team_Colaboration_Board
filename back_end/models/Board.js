import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  deadline: Date,
  members: [String],
  status: { type: String, default: "active" }, // active / completed / etc.
  completed: { type: Boolean, default: false }, // optional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account" } // optional
}, { timestamps: true });

export default mongoose.model("Board", boardSchema);
