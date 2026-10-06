import API from "../services/api";

const DownloadButton = () => {

  const handleDownload = async () => {
    try {
      const response = await API.get(
        "/tasks/download",
        {
          responseType: "blob"
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv;charset=utf-8;"
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "tasks.csv");

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "DOWNLOAD TASKS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to download tasks"
      );
    }
  };

  return (
    <button
      type="button"
      className="download-task-button"
      onClick={handleDownload}
    >
      Download Tasks
    </button>
  );
};

export default DownloadButton;