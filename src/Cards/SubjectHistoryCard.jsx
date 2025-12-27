import React, { useEffect } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";

export default function SubjectHistoryCard({ subjectId, close }) {
  const { getHistory, historyData, loadingHistory } = useHistory();
  const { markAttendance } = useAttendance();
  const history = historyData[subjectId];

  useEffect(() => {
    if (subjectId) {
      getHistory(subjectId);
    }
  }, [subjectId]);

  if (loadingHistory) return <p>Loading history...</p>;
  if (!history) return <p>No history found.</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "20px",
        background: "#f8f8f8",
      }}
    >
      <h2>History: {history.subjectName}</h2>

      <p>
        <strong>Subject Added:</strong>{" "}
        {new Date(history.createdAt).toLocaleString()}
      </p>

      <h3>Attendance History</h3>

      {history.attendance.length === 0 ? (
        <p>No attendance history yet.</p>
      ) : (
        <ul>
          {history.attendance.map((rec) => (
            <li key={rec.$id}>
              <strong>{rec.ClassDate}</strong> — {rec.ClassDay} @{" "}
              {rec.ClassTime} → <strong>{rec.Status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
