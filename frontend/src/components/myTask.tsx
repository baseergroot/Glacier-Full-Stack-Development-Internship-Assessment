const MyTask = ({ tasks }) => {
  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Tasks</h1>

      {(!tasks || tasks.length === 0) ? (
        <p className="text-gray-500 text-lg text-center">No tasks assigned to you.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col w-full sm:w-80 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {task.title}
              </h2>

              {/* Description */}
              {task.description && (
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Info footer */}
              <div className="mt-auto pt-4 flex flex-wrap justify-around items-center gap-3 text-sm">
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-500"
                      : task.status === "in-progress"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                >
                  {task.status}
                </span>

                {/* Due Date (placeholder if missing) */}
                <span className="text-gray-500">
                  📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Coming soon"}
                </span>

                {/* Team */}
                {task.team && (
                  <span className="font-medium text-blue-600">
                    👥 {task.team.title}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyTask;
