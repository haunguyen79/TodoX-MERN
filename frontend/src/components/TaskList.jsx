import TaskEmptyState from "./TaskEmptyState";
import TaskCard from "./TaskCard";

const TaskList = ({ filteredTasks, filter, handleTaskChanged }) => {
  // const filteredTasks = [
  //   {
  //     _id: 1,
  //     title: "Learn React",
  //     status: "active",
  //     completedAt: null,
  //     createdAt: new Date(),
  //   },
  //   {
  //     _id: 2,
  //     title: "Learn Javascript",
  //     status: "complete",
  //     completedAt: new Date(),
  //     createdAt: new Date(),
  //   },
  //   {
  //     _id: 3,
  //     title: "Learn Typescript",
  //     status: "complete",
  //     completedAt: null,
  //     createdAt: new Date(),
  //   },
  //   {
  //     _id: 4,
  //     title: "Learn NodeJS",
  //     status: "complete",
  //     completedAt: new Date(),
  //     createdAt: new Date(),
  //   },
  //   {
  //     _id: 5,
  //     title: "Learn MongoDB",
  //     status: "active",
  //     completedAt: new Date(),
  //     createdAt: new Date(),
  //   },
  // ];

  if (!filteredTasks || filteredTasks.length === 0) {
    return <TaskEmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task._id ?? index}
          task={task}
          index={index}
          handleTaskChanged={handleTaskChanged}
        />
      ))}
    </div>
  );
};

export default TaskList;
