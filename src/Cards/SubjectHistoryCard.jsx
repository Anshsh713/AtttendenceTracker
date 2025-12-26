import React, { useEffect } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";

export default function SubjectHistoryCard({ subjectId, close }) {
  const { getHistory, historyData, loadingHistory } = useHistory();
  const { markAttendance } = useAttendance();

  const history = historyData[subjectId];

  useEffect(() => {
    if (subjectId) getHistory(subjectId);
  }, [subjectId]);

  if (loadingHistory) return <p>Loading history...</p>;
  if (!history) return <p>No history found.</p>;

  // ----------- Build all past class dates from schedule -----------
  const createdDate = new Date(history.createdAt);
  const today = new Date();

  const schedule = history.schedules || [];
  const attendance = history.attendance || [];

  const allClassInstances = [];

  schedule.forEach((sch) => {
    let current = new Date(createdDate);

    while (current <= today) {
      const dayName = current.toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (dayName === sch.day) {
        allClassInstances.push({
          date: current.toISOString().split("T")[0],
          day: sch.day,
          time: sch.time,
        });
      }

      current.setDate(current.getDate() + 1);
    }
  });

  // ----------- Merge attendance with schedule -----------
  const merged = allClassInstances
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((cls) => {
      const rec = attendance.find(
        (a) => a.ClassDate === cls.date && a.ClassTime === cls.time
      );
      return { ...cls, record: rec };
    });

  // ----------- Handler -----------
  const handleMark = async (status, cls) => {
    await markAttendance(
      status,
      { subjectId, subjectName: history.subjectName },
      { day: cls.day, time: cls.time, date: cls.date }
    );

    getHistory(subjectId); // refresh view
  };

  return (
    <div
      style={{
        maxWidth: "650px",
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

      <hr />

      <h3>Class History</h3>

      {merged.length === 0 ? (
        <p>No class history yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {merged.map((cls, idx) => (
            <li
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                marginBottom: "10px",
                padding: "10px",
                background: "#fff",
              }}
            >
              <p>
                <strong>{cls.date}</strong> — {cls.day} @ {cls.time}
              </p>

              {cls.record ? (
                <p>
                  Status:{" "}
                  <strong style={{ color: "#4f46e5" }}>
                    {cls.record.Status}
                  </strong>
                </p>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    title="Present"
                    onClick={() => handleMark("Present", cls)}
                  />
                  <Button
                    title="Absent"
                    onClick={() => handleMark("Absent", cls)}
                  />
                  <Button
                    title="Canceled"
                    onClick={() => handleMark("Canceled", cls)}
                  />
                  <Button title="NOT" onClick={() => handleMark("NOT", cls)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Button title="Close" onClick={close} />
    </div>
  );
}
