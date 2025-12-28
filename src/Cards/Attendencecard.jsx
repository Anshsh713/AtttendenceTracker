import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateAttendenceform from "../Forms/UpdateAttendenceform.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";
import "./Attendencecard.css";

export default function Attendencecard({ subject = [], onAttendenceMarked }) {
  const {
    attendanceRecords,
    fetchAttendance,
    markAttendance,
    loading,
    UpdateAttendance,
  } = useAttendance();

  const [lastAction, setLastAction] = useState("");
  const [editingkey, setEditingKey] = useState(null);

  useEffect(() => {
    setEditingKey(null);
    setLastAction("");
    if (Array.isArray(subject) && subject.length > 0) {
      fetchAttendance(subject);
    }
  }, [subject]);

  const handleAttendance = async (status, subj, schedule) => {
    try {
      await markAttendance(status, subj, schedule);
      if (onAttendenceMarked) onAttendenceMarked();
      setLastAction(
        `Marked "${status}" for ${subj.subjectName} on ${schedule.day} at ${schedule.time}`
      );
    } catch (error) {
      setLastAction(`Error: ${error.message}`);
    }
  };

  if (loading) return <p className="loading">Loading attendance...</p>;
  if (!Array.isArray(subject) || subject.length === 0)
    return <p className="empty-message">No class scheduled for this day</p>;

  return (
    <div>
      {subject.map((subj) => (
        <div key={subj.subjectId} className="attendance-card">
          <h3>{subj.subjectName}</h3>

          <ul className="class-list">
            {subj.schedules?.map((schedule, index) => {
              const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
              const record = attendanceRecords?.[key] || null;

              return (
                <li key={index} className="class-item">
                  <p>
                    <strong>{schedule.day}</strong> — {schedule.time}
                  </p>
                  <div className="button-group">
                    {record ? (
                      <>
                        <span className="status-label">
                          Your attendance: {record.Status}
                        </span>

                        <Button
                          title="Mistake?"
                          onClick={() =>
                            setEditingKey((prev) => (prev === key ? null : key))
                          }
                        />

                        {editingkey === key && (
                          <div
                            className="modal-overlay"
                            onClick={() => setEditingKey(null)}
                          >
                            <div
                              className="modal-box"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="modal-close"
                                onClick={() => setEditingKey(null)}
                              >
                                Close ✖
                              </button>

                              <UpdateAttendenceform
                                updateClass={async (data) => {
                                  const success = await UpdateAttendance(
                                    subj,
                                    schedule,
                                    data
                                  );
                                  if (success) setEditingKey(null);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          title="Present"
                          className="primary"
                          onClick={() =>
                            handleAttendance("Present", subj, schedule)
                          }
                        />
                        <Button
                          title="Absent"
                          onClick={() =>
                            handleAttendance("Absent", subj, schedule)
                          }
                        />
                        <Button
                          title="Canceled"
                          onClick={() =>
                            handleAttendance("Canceled", subj, schedule)
                          }
                        />
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
