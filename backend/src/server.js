import express from "express";
import tasksRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

//middlewares
app.use(express.json()); // Giúp server hiểu được dữ liệu gửi lên từ client là dạng JSON

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://todox-mern-fullstack.vercel.app",
      ],
    })
  );
}

app.use("/api/tasks", tasksRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Kết nối DB rồi mới start server
connectDB().then(() => {
  // Kết nối DB thành công thì mới chạy server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
