import React, { useEffect } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";
import "./SubjectHistoryCard.css";

export default function SubjectHistoryCard({ subjectId, close }) {
  const { getHistory, historyData, loadingHistory } = useHistory();
  const { markAttendance } = useAttendance();
  const history = historyData[subjectId];

  useEffect(() => {
    if (subjectId) getHistory(subjectId);
  }, [subjectId]);

  if (loadingHistory) return <p>Loading history...</p>;
  if (!history) return <p>No history found.</p>;

  return (
    <div className="history-card">
      <h2>History: {history.subjectName}</h2>

      <p>
        <strong>Subject Added:</strong>{" "}
        {new Date(history.createdAt).toLocaleString()}
      </p>

      <h3>Attendance History</h3>

      {history.attendance.length === 0 ? (
        <p>No attendance history yet.</p>
      ) : (
        <ul className="history-list">
          {history.attendance.map((rec) => (
            <li key={rec.$id} className="history-item">
              <span>
                <strong>{rec.ClassDate}</strong> — {rec.ClassDay} @{" "}
                {rec.ClassTime}
              </span>

              <span
                className={`history-status ${
                  rec.Status === "Present"
                    ? "present"
                    : rec.Status === "Absent"
                    ? "absent"
                    : "canceled"
                }`}
              >
                {rec.Status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
