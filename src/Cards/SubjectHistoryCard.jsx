import React, { useEffect } from "react";
import Button from "../Common_Componenets/Common_Button/Button.jsx";
import { useHistory } from "../Context/HistoryContext.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";
import { useSchedule } from "../Context/ScheduleContext.jsx";
import "./SubjectHistoryCard.css";

export default function SubjectHistoryCard({ subjectId, close }) {
  const { getHistory, historyData, loadingHistory } = useHistory();
  const { markAttendance } = useAttendance();
  const { allSubjects } = useSchedule();

  const history = historyData[subjectId];

  const subject = allSubjects.find((s) => s.$id === subjectId);

  useEffect(() => {
    if (subjectId) getHistory(subjectId);
  }, [subjectId]);

  if (loadingHistory) return <p>Loading history...</p>;
  if (!history || !subject) return <p>No history found.</p>;

  // Create lookup map for fast check
  const attendanceMap = {};
  history.attendance.forEach((rec) => {
    const key = `${rec.ClassDate}_${rec.ClassDay}_${rec.ClassTime}`;
    attendanceMap[key] = rec;
  });

  const handleMark = async (schedule, date) => {
    await markAttendance(
      "Present",
      {
        subjectId: subjectId,
        subjectName: history.subjectName,
      },
      {
        day: schedule.day,
        time: schedule.time,
        date: date,
      },
    );

    // refresh history after marking
    getHistory(subjectId);
  };

  return (
    <div className="history-card">
      <h2>History: {history.subjectName}</h2>

      <p>
        <strong>Subject Added:</strong>{" "}
        {new Date(history.createdAt).toLocaleString()}
      </p>

      <h3>Attendance History</h3>

      <ul className="history-list">
        {subject.ClassesSchedule?.map((schedule, index) => {
          const date = history.attendance?.[0]?.ClassDate || "";

          const key = `${date}_${schedule.day}_${schedule.time}`;

          const record = attendanceMap[key];

          return (
            <li key={index} className="history-item">
              <span>
                <strong>{date || "—"}</strong> — {schedule.day} @{" "}
                {schedule.time}
              </span>

              {record ? (
                <span
                  className={`history-status ${
                    record.Status === "Present"
                      ? "Present"
                      : record.Status === "Absent"
                      ? "Absent"
                      : "Canceled"
                  }`}
                >
                  {record.Status}
                </span>
              ) : (
                <Button
                  title="Mark Attendance"
                  onClick={() => handleMark(schedule, date)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
