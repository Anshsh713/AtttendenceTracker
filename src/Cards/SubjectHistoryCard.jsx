import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import "./SubjectHistoryCard.css";
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
          {history.attendance.map((rec, index) => (
            <li key={rec.$id} className="history-item">
              <span>
                <strong>{rec.ClassDate}</strong> — {rec.ClassDay} {rec.ClassTime}
              </span>

              <span
                className={`history-status ${rec.Status === "Present"
                    ? "present"
                    : rec.Status === "Absent" || rec.Status === "NOT"
                      ? "absent"
                      : "canceled"
                  }`}
              >
                {rec.Status}
              </span>

              <Button title="Mistake" onClick={() => setMistake(rec)} />
            </li>
          ))}
        </ul>
      )}

      {mistake && (
        <div
          className="modal-overlay"
          onClick={() => setMistake(null)}
        >
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
        </div>
      )}
    </div>
  );
}
