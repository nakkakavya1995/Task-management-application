import { useState } from "react";
import API from "../services/api";

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "MEDIUM",
    status: task.status || "PENDING",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : ""
  });

  const updateStatus = async (status) => {
    try {
      setStatusLoading(true);

      const response = await API.put(
        `/tasks/${task._id}`,
        {
          status: status
        }
      );

      console.log("STATUS UPDATED:", response.data);

      onUpdate(response.data.task);

      setEditForm((previous) => ({
        ...previous,
        status: status
      }));
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update task status"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const saveTask = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await API.put(
        `/tasks/${task._id}`,
        editForm
      );

      console.log("TASK UPDATED:", response.data);

      onUpdate(response.data.task);

      setIsEditing(false);
    } catch (error) {
      console.error("EDIT TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update task"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/tasks/${task._id}`);

      console.log("TASK DELETED:", task._id);

      onDelete(task._id);
    } catch (error) {
      console.error("DELETE TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  const openEditMode = () => {
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "PENDING",
      dueDate: task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    });

    setIsEditing(true);
  };

  const getProgressStep = () => {
    if (task.status === "COMPLETED") {
      return 3;
    }

    if (task.status === "IN_PROGRESS") {
      return 2;
    }

    return 1;
  };

  const getProgressLabel = () => {
    if (task.status === "COMPLETED") {
      return "Completed";
    }

    if (task.status === "IN_PROGRESS") {
      return "In Progress";
    }

    return "Pending";
  };

  const progressStep = getProgressStep();

  if (isEditing) {
    return (
      <div className="task-card edit-task-card">

        <div className="task-header">
          <h3>Edit Task</h3>
        </div>

        <form onSubmit={saveTask}>

          <label htmlFor={`title-${task._id}`}>
            Task Title
          </label>

          <input
            id={`title-${task._id}`}
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            placeholder="Enter task title"
            required
          />

          <label htmlFor={`description-${task._id}`}>
            Description
          </label>

          <textarea
            id={`description-${task._id}`}
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            placeholder="Enter task description"
          />

          <label htmlFor={`priority-${task._id}`}>
            Priority
          </label>

          <select
            id={`priority-${task._id}`}
            name="priority"
            value={editForm.priority}
            onChange={handleEditChange}
          >
            <option value="LOW">
              LOW
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="HIGH">
              HIGH
            </option>
          </select>

          <label htmlFor={`edit-status-${task._id}`}>
            Status
          </label>

          <select
            id={`edit-status-${task._id}`}
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
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

          <label htmlFor={`dueDate-${task._id}`}>
            Due Date
          </label>

          <input
            id={`dueDate-${task._id}`}
            type="date"
            name="dueDate"
            value={editForm.dueDate}
            onChange={handleEditChange}
          />

          <div
            className="edit-actions"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    );
  }


  return (
    <div className="task-card">

      <div className="task-header">

        <h3>
          {task.title}
        </h3>

        <span
          className={`priority priority-${(
            task.priority || "MEDIUM"
          ).toLowerCase()}`}
        >
          {task.priority || "MEDIUM"}
        </span>

      </div>



      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

 

      <div className="task-details">

        <span>
          <strong>Status:</strong>{" "}
          {task.status === "IN_PROGRESS"
            ? "IN PROGRESS"
            : task.status}
        </span>

        <span>
          <strong>Due:</strong>{" "}
          {task.dueDate
            ? new Date(
                task.dueDate
              ).toLocaleDateString()
            : "No due date"}
        </span>

      </div>

      <div
        className="task-progress"
        style={{
          width: "100%",
          margin: "20px 0"
        }}
      >

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >

          <span
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#374151"
            }}
          >
            Task Progress
          </span>

          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#4f46e5"
            }}
          >
            {getProgressLabel()}
          </span>

        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "6px",
            alignItems: "center"
          }}
        >

          <div
            style={{
              flex: "1",
              height: "12px",
              borderRadius: "6px",
              backgroundColor:
                progressStep >= 1
                  ? "#4f46e5"
                  : "#e5e7eb"
            }}
          />

          <div
            style={{
              flex: "1",
              height: "12px",
              borderRadius: "6px",
              backgroundColor:
                progressStep >= 2
                  ? "#4f46e5"
                  : "#e5e7eb"
            }}
          />

          <div
            style={{
              flex: "1",
              height: "12px",
              borderRadius: "6px",
              backgroundColor:
                progressStep >= 3
                  ? "#4f46e5"
                  : "#e5e7eb"
            }}
          />

        </div>

        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            marginTop: "8px"
          }}
        >

          <span
            style={{
              display: "block",
              textAlign: "left",
              fontSize: "11px",
              color: "#6b7280",
              whiteSpace: "nowrap"
            }}
          >
            Pending
          </span>

          <span
            style={{
              display: "block",
              textAlign: "center",
              fontSize: "11px",
              color: "#6b7280",
              whiteSpace: "nowrap"
            }}
          >
            In Progress
          </span>

          <span
            style={{
              display: "block",
              textAlign: "right",
              fontSize: "11px",
              color: "#6b7280",
              whiteSpace: "nowrap"
            }}
          >
            Completed
          </span>

        </div>

      </div>



      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "18px",
          flexWrap: "wrap"
        }}
      >
        <select
          value={task.status}
          onChange={(event) =>
            updateStatus(event.target.value)
          }
          disabled={statusLoading}
          style={{
            width: "150px",
            height: "38px",
            padding: "0 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer"
          }}
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
          type="button"
          onClick={openEditMode}
          style={{
            width: "80px",
            height: "38px",
            padding: "0",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={deleteTask}
          style={{
            width: "80px",
            height: "38px",
            padding: "0",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default TaskCard;