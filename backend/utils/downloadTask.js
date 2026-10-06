const createTaskCSV = (tasks) => {
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Due Date",
    "Created By",
    "Assigned To",
    "Created At"
  ];

  const rows = tasks.map((task) => {
    return [
      task.title,
      task.description,
      task.priority,
      task.status,
      task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "",
      task.user?.name || "",
      task.assignedTo?.name || "Unassigned",
      task.createdAt
        ? new Date(task.createdAt).toLocaleString()
        : ""
    ];
  });

  const escapeCSV = (value) => {
    const stringValue = String(value ?? "");

    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      row.map(escapeCSV).join(",")
    )
  ].join("\n");
};

module.exports = createTaskCSV;