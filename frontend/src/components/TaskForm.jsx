import { useState } from "react";
import API from "../services/api";

function TaskForm({ onTaskCreated }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await API.post(
        "/tasks",
        form
      );

      console.log(
        "TASK CREATED:",
        response.data
      );

      onTaskCreated(response.data.task);

      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: ""
      });

    } catch (error) {

      console.error(
        "CREATE TASK ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to create task"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">

      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
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

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
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

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button type="submit">
          {loading
            ? "Creating..."
            : "Create Task"}
        </button>

      </form>

    </div>
  );
}

export default TaskForm;