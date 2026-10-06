import { useEffect, useState } from "react";
import API from "../services/api";

function TaskHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/history");

      console.log("HISTORY RESPONSE:", response.data);

      setHistory(response.data);
    } catch (error) {
      console.error("FETCH HISTORY ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load task history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Get icon based on action
  const getIcon = (action) => {
    const text = (action || "").toLowerCase();

    if (text.includes("created")) {
      return "✓";
    }

    if (text.includes("assigned")) {
      return "👤";
    }

    if (text.includes("status")) {
      return "↻";
    }

    if (text.includes("priority")) {
      return "⚡";
    }

    if (text.includes("updated")) {
      return "✎";
    }

    if (text.includes("deleted")) {
      return "🗑";
    }

    return "•";
  };
  const getActionText = (item) => {
    if (!item.action) {
      return "Task activity";
    }

    const action = item.action.toLowerCase();

    // Task assignment
    if (action.includes("assigned")) {
      return item.newValue
        ? `Task Assigned to ${item.newValue}`
        : "Task Assigned";
    }

    return item.action;
  };
  const getActionType = (action) => {
    const text = (action || "").toLowerCase();

    if (text.includes("created")) {
      return "created";
    }

    if (text.includes("assigned")) {
      return "assigned";
    }

    if (text.includes("deleted")) {
      return "deleted";
    }

    if (text.includes("status")) {
      return "status";
    }

    if (text.includes("priority")) {
      return "priority";
    }

    if (text.includes("updated")) {
      return "updated";
    }

    return "default";
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const formattedDate = new Date(date);

    return formattedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // Get performer name
  const getPerformerName = (item) => {
    if (
      item.performedBy &&
      typeof item.performedBy === "object"
    ) {
      return (
        item.performedBy.name ||
        item.performedBy.email ||
        "Unknown user"
      );
    }

    return "Unknown user";
  };

  // Check whether action is assignment
  const isAssignmentAction = (item) => {
    return (item.action || "")
      .toLowerCase()
      .includes("assigned");
  };

  return (
    <section className="history-section">

      {/* Header */}
      <div className="history-header">

        <div className="history-title-area">

          <h2>Task History</h2>

          <p>
            Track your recent task activities
          </p>

        </div>

        <button
          type="button"
          className="refresh-history"
          onClick={fetchHistory}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="history-loading">

          <div className="history-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <p>
            Loading task history...
          </p>

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="history-error">

          <div className="history-error-icon">
            !
          </div>

          <div>
            <h3>
              Unable to load history
            </h3>

            <p>
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchHistory}
          >
            Try Again
          </button>

        </div>
      )}

      {/* Empty History */}
      {!loading &&
        !error &&
        history.length === 0 && (

          <div className="empty-history">

            <div className="empty-history-icon">
              📋
            </div>

            <h3>
              No History Yet
            </h3>

            <p>
              Your task activities will appear here.
            </p>

          </div>

        )}

      {/* History List */}
      {!loading &&
        !error &&
        history.length > 0 && (

          <div className="history-list">

            {history.map((item) => {

              const actionType =
                getActionType(item.action);

              return (
                <div
                  className={`history-item ${actionType}`}
                  key={item._id}
                >

                  {/* Timeline Icon */}
                  <div
                    className={`history-icon ${actionType}`}
                  >
                    {getIcon(item.action)}
                  </div>

                  {/* Content */}
                  <div className="history-content">

                    {/* Top Row */}
                    <div className="history-top-row">

                      <span className="history-date">
                        {formatDate(item.createdAt)}
                      </span>

                      <span
                        className={`history-badge ${actionType}`}
                      >
                        {actionType}
                      </span>

                    </div>

                    {/* Action */}
                    <h3>
                      {getActionText(item)}
                    </h3>

                    {/* Task Name */}
                    {item.taskTitle && (
                      <div className="history-detail">

                        <span className="detail-label">
                          Task
                        </span>

                        <span className="detail-value">
                          {item.taskTitle}
                        </span>

                      </div>
                    )}

                    {/* Old Value */}
                    {item.oldValue &&
                      !isAssignmentAction(item) && (

                      <div className="history-detail">

                        <span className="detail-label">
                          Old
                        </span>

                        <span className="detail-value">
                          {item.oldValue}
                        </span>

                      </div>

                    )}

                    {/* New Value */}
                    {item.newValue &&
                      !isAssignmentAction(item) && (

                      <div className="history-detail">

                        <span className="detail-label">
                          New
                        </span>

                        <span className="detail-value">
                          {item.newValue}
                        </span>

                      </div>

                    )}

                    {/* Performer */}
                    <div className="history-performer">

                      <span className="performer-icon">
                        👤
                      </span>

                      <span>
                        By{" "}
                        <strong>
                          {getPerformerName(item)}
                        </strong>
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

    </section>
  );
}

export default TaskHistory;