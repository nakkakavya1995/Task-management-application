import { useEffect, useState } from "react";
import API from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await API.get("/history");

        console.log("HISTORY DATA:", response.data);

        setHistory(response.data);
      } catch (error) {
        console.error("HISTORY ERROR:", error);

        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load history"
        );
      }
    };

    loadHistory();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Task History</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!error && history.length === 0 && (
        <p>No history found.</p>
      )}

      {history.map((item) => (
        <div
          key={item._id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            border: "1px solid #ddd"
          }}
        >
          <h3>{item.action}</h3>

          <p>
            Task: {item.taskTitle || "Unknown task"}
          </p>

          {item.oldValue && (
            <p>Old: {item.oldValue}</p>
          )}

          {item.newValue && (
            <p>New: {item.newValue}</p>
          )}

          <small>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleString()
              : ""}
          </small>
        </div>
      ))}
    </div>
  );
}

export default History;