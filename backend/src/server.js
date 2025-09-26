import express from "express";
import tasksRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

//middlewares
app.use(express.json()); // Giúp server hiểu được dữ liệu gửi lên từ client là dạng JSON
app.use(cors({ origin: "http://localhost:5173" })); // Chỉ cho phép frontend ở cổng 5173 kết nối

app.use("/api/tasks", tasksRoute);

connectDB().then(() => {
  // Kết nối DB thành công thì mới chạy server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


