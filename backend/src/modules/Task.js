import mongoose from "mongoose";

// Tạo schema cho collection "tasks"
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "complete"],
      default: "active",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,   // Mongoose sẽ tự động thêm 2 trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const Task = mongoose.model("Task", taskSchema);
export default Task;