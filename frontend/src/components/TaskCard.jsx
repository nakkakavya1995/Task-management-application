import API from "../services/api";

function TaskCard({
  task,
  onDelete,
  onUpdate
}) {

  const updateStatus = async (status) => {

    try {

      const response = await API.put(
        `/tasks/${task._id}`,
        {
          status
        }
      );

      onUpdate(response.data.task);

    } catch (error) {

      console.error(
        "UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update task"
      );

    }
  };

  const deleteTask = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/tasks/${task._id}`
      );

      onDelete(task._id);

    } catch (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete task"
      );

    }
  };

  return (
    <div className="task-card">

      <div className="task-header">

        <h3>
          {task.title}
        </h3>

        <span className="priority">
          {task.priority}
        </span>

      </div>

      <p>
        {task.description}
      </p>

      <div className="task-details">

        <span>
          Status: {task.status}
        </span>

        <span>
          Due:{" "}
          {task.dueDate
            ? new Date(
                task.dueDate
              ).toLocaleDateString()
            : "No due date"}
        </span>

      </div>

      <div className="task-actions">

        <select
          value={task.status}
          onChange={(e) =>
            updateStatus(e.target.value)
          }
        >
          <option value="PENDING">
            PENDING
          </option>

          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>

          <option value="COMPLETED">
            COMPLETED
          </option>
        </select>

        <button
          className="delete-btn"
          onClick={deleteTask}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default TaskCard;