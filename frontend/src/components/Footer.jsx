const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTasksCount > 0 && (
              <>
                🎉 Tuyệt vời! Bạn đã hoàn thành xong {completedTasksCount} việc
                {""}
                {activeTasksCount > 0 &&
                  `, còn ${activeTasksCount} việc nữa thôi. Cố lên! 💪
`}
              </>
            )}

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>🚀 Bạn có {activeTasksCount} việc cần hoàn thành. Cố lên! 💪</>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default Footer;
