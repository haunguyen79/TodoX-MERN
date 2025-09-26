import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || ""); // Tiêu đề đang được chỉnh sửa;

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xóa.");
      handleTaskChanged(); // Gọi hàm callback để thông báo nhiệm vụ đã được xóa
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa Task.", error);
      toast.error("Lỗi xảy ra khi xóa nhiệm vụ.");
    }
  };

  const updateTask = async () => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`, {
        title: updateTaskTitle,
      });
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}.`);
      handleTaskChanged(); // Gọi hàm callback để thông báo nhiệm vụ đã được cập nhật
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật Task.", error);
      toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ mới.");
    }
  };

  const toggleTaskCompleteButton = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString(), // Ghi lại thời gian hoàn thành theo giờ Quốc tế
        });
        toast.success(`Nhiệm vụ ${task.title} đã hoàn thành.`);
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null, // Xóa thời gian hoàn thành
        });
        toast.success(`Nhiệm vụ ${task.title} đã đổi sang chưa hoàn thành.`);
      }
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật trạng thái Task.", error);
      toast.error("Lỗi xảy ra khi cập nhật trạng thái nhiệm vụ.");
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      updateTask();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "complete" && "opacity-75" // Làm mờ Task
      )}
      style={{ animationDelay: `${index * 50}ms` }} // Tạo hiệu ứng trễ
    >
      <div className="flex items-center gap-4">
        {/*Nút tròn: Đánh dấu nhiệm vụ đã Hoàn thành chưa*/}
        <Button
          variant="ghost" // Nút trong suốt
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskCompleteButton}
        >
          {task.status === "complete" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/*Hiển thị hoặc chỉnh sửa Tiêu đề*/}
        <div className="flex-1 min-w-0">
          {isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                // Được kích hoạt khi người dùng nhấp ra ngoài phạm vi của ô input
                setIsEditting(false);
                setUpdateTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/*Ngày tạo và hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/*Nút chỉnh sửa và xóa*/}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Nút chỉnh sửa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditting(true);
              setUpdateTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Nút xóa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
