import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

router.get("/", getAllTasks);

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
