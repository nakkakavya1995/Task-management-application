import { useEffect, useState } from "react";
import API from "../services/api";

function TaskForm({ onTaskCreated }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "",
    assignedTo: ""
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for task assignment
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const response = await API.get("/users");

        setUsers(response.data);

      } catch (error) {

        console.error(
          "FETCH USERS ERROR:",
          error
        );

      }
    };

    fetchUsers();

  }, []);

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

      const taskData = {
        ...form,
        assignedTo: form.assignedTo || null
      };

      const response = await API.post(
        "/tasks",
        taskData
      );

      console.log(
        "TASK CREATED:",
        response.data
      );

      onTaskCreated(response.data.task);

      // Reset form
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: "",
        assignedTo: ""
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

        {/* Task Title */}
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={handleChange}
        />

        {/* Priority */}
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

        {/* Status */}
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
        <label>
          Assign To
        </label>

        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
        >

          <option value="">
            Unassigned
          </option>

          {users.map((user) => (

            <option
              key={user._id}
              value={user._id}
            >
              {user.name} ({user.email})
            </option>

          ))}

        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Task"}
        </button>

      </form>

    </div>
  );
}

export default TaskForm;