import Task from "../modules/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-09-26 00:00
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0); // Ngày đầu tuần (Thứ 2)
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày đầu tháng
      break;
    }
    case "all":
    default: {
      startDate = null; // Không lọc
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // const tasks = await Task.find().sort({ createdAt: "desc" });
    // const tasks = await Task.find().sort({ createdAt: -1 }); // Lấy tất cả document trong collection "tasks" và sắp xếp theo thứ tự giảm dần của trường createdAt

    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });

    // Giả lập lỗi để kiểm tra cơ chế xử lý lỗi
    // throw new Error("Lỗi thử nghiệm");
  } catch (error) {
    console.error("Lỗi khi gọi getAllTask:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body; // Lấy title mà User gửi lên từ body của request

    const task = new Task({ title }); // Tạo một document mới từ model Task

    const newTask = await task.save(); // Lưu document mới vào trong database MongoDB

    res.status(201).json(newTask); // Trả về document mới tạo dưới dạng JSON cho client
  } catch (error) {
    console.error("Lỗi khi gọi createTask:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      // Tìm và cập nhật document dựa trên ID
      req.params.id, // Lấy ID từ tham số của URL
      { title, status, completedAt },
      { new: true } // Trả về document đã được cập nhật
    );
    if (!updatedTask) {
      // Nếu không tìm thấy document với ID tương ứng, trả về lỗi 404
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại!" });
    }
    res.status(200).json(updatedTask); // Trả về document đã được cập nhật dưới dạng JSON cho client
  } catch (error) {
    console.error("Lỗi khi gọi updateTask:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại!" });
    }
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};
