import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import DownloadButton from "../components/DownloadButton";
import TaskHistory from "../components/TaskHistory";

import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("tasks");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Getting tasks...");

      const response = await API.get("/tasks");

      console.log("TASKS RESPONSE:", response.data);

      setTasks(response.data);

    } catch (error) {
      console.error("GET TASKS ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load tasks"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = (task) => {
    setTasks((oldTasks) => [
      task,
      ...oldTasks
    ]);
  };
  const deleteTask = (id) => {
    setTasks((oldTasks) =>
      oldTasks.filter(
        (task) => task._id !== id
      )
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((oldTasks) =>
      oldTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );
  };

  const total = tasks.length;

  const pending = tasks.filter(
    (task) =>
      task.status === "PENDING"
  ).length;

  const inProgress = tasks.filter(
    (task) =>
      task.status === "IN_PROGRESS"
  ).length;

  const completed = tasks.filter(
    (task) =>
      task.status === "COMPLETED"
  ).length;

  return (
    <>
      <Navbar />

      <main className="dashboard">

        <div className="dashboard-header">

          <div>
            <h1>
              Task Management Dashboard
            </h1>

            <p className="subtitle">
              Manage your tasks easily.
            </p>
          </div>

          <div className="download-section">
            <DownloadButton />
          </div>

        </div>

        <div className="stats">

          <div className="stat-card">
            <h3>Total</h3>
            <strong>
              {total}
            </strong>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <strong>
              {pending}
            </strong>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <strong>
              {inProgress}
            </strong>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <strong>
              {completed}
            </strong>
          </div>

        </div>

        <div className="dashboard-tabs">

          <button
            type="button"
            className={
              activeSection === "tasks"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() =>
              setActiveSection("tasks")
            }
          >
            📋 My Tasks
          </button>

          <button
            type="button"
            className={
              activeSection === "history"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() =>
              setActiveSection("history")
            }
          >
            🕒 Task History
          </button>

        </div>

        {activeSection === "tasks" && (
          <>

            <TaskForm
              onTaskCreated={addTask}
            />

            <section className="tasks-section">

              <div className="section-header">

                <div>

                  <h2>
                    My Tasks
                  </h2>

                  <p>
                    View and manage your tasks
                  </p>

                </div>

              </div>

              {loading && (
                <div className="loading">

                  <p>
                    Loading tasks...
                  </p>

                </div>
              )}

              {error && (
                <div className="error">

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchTasks}
                  >
                    Retry
                  </button>

                </div>
              )}

              {!loading &&
                !error &&
                tasks.length === 0 && (

                  <div className="empty-state">

                    <h3>
                      No tasks found
                    </h3>

                    <p>
                      Create your first task
                      to get started.
                    </p>

                  </div>

                )}

              {!loading &&
                !error &&
                tasks.length > 0 && (

                  <div className="task-grid">

                    {tasks.map((task) => (

                      <TaskCard
                        key={task._id}
                        task={task}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                      />

                    ))}

                  </div>

                )}

            </section>

          </>
        )}

        {activeSection === "history" && (
          <TaskHistory />
        )}

      </main>
    </>
  );
}

export default Dashboard;