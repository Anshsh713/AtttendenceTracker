import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import "./SubjectHistoryCard.css";
import { createPortal } from "react-dom";
import Updateformhistory from "../Forms/Updateformhistory.jsx";

export default function SubjectHistoryCard({ subjectId, close }) {
  const { getHistory, historyData, loadingHistory } = useHistory();
  const history = historyData[subjectId];

  const [mistake, setMistake] = useState(null);

  const togglemistake = (key) => {
    setMistake((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (subjectId) getHistory(subjectId);
  }, [subjectId]);

  if (loadingHistory)
    return (
      <div className="load">
        <i className="fa-solid fa-spinner fa-spin-pulse"></i>
        <p>Loading History...</p>
      </div>
    );
  if (!history)
    return (
      <div className="subjectNot">
        <p>No history found.</p>
      </div>
    );

  return (
    <div className="history-card">
      {console.log(history)}
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
          {history.attendance.map((rec, index) => (
            <li key={rec.$id} className="history-item">
              <span>
                <strong>{rec.ClassDate}</strong> — {rec.ClassDay}{" "}
                {rec.ClassTime}
              </span>

              <span
                className={`history-status ${
                  rec.Status === "Present"
                    ? "present"
                    : rec.Status === "Absent"
                    ? "absent"
                    : rec.Status === "NOT"
                    ? "not"
                    : "canceled"
                }`}
              >
                {rec.Status === "NOT" ? "Missed (Auto)" : rec.Status}
              </span>

              <Button title="Mistake" onClick={() => setMistake(rec)} />
            </li>
          ))}
        </ul>
      )}

      {mistake &&
        createPortal(
          <div className="modal-overlay" onClick={() => setMistake(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setMistake(null)}>
                ✖
              </button>

              <Updateformhistory
                record={mistake}
                onSuccess={async () => {
                  await getHistory(subjectId);
                  setMistake(null);
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
