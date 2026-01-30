import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateAttendenceform from "../Forms/UpdateAttendenceform.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";
import "./Attendencecard.css";
import { Flag } from "appwrite";

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
  const [attending, setAttending] = useState(false);
  const [attend, setAttend] = useState("");

  useEffect(() => {
    setEditingKey(null);
    setLastAction("");
    if (Array.isArray(subject) && subject.length > 0) {
      fetchAttendance(subject);
    }
  }, [subject]);

  const handleAttendance = async (status, subj, schedule) => {
    try {
      setAttending(true);
      await markAttendance(status, subj, schedule);
      if (onAttendenceMarked) onAttendenceMarked();
      setLastAction(
        `Marked "${status}" for ${subj.subjectName} on ${schedule.day} at ${schedule.time}`,
      );
    } catch (error) {
      setLastAction(`Error: ${error.message}`);
    } finally {
      setAttending(false);
    }
  };

  const AttendingStatus = (status) => {
    if (!attending) return status;

    return attend === status ? `${status} Today...` : status;
  };

  if (loading)
    return (
      <div className="notfound">
        <p className="empty-text">Subject Not Found</p>
      </div>
    );
  if (!Array.isArray(subject) || subject.length === 0)
    return (
      <div className="subjectNot">
        <p className="empty-message">No class scheduled for this day</p>
      </div>
    );

  return (
    <div>
      {subject.map((subj) => (
        <React.Fragment key={subj.subjectId}>
          <div className="attendance-card">
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
                              setEditingKey((prev) =>
                                prev === key ? null : key,
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            title={AttendingStatus("Present")}
                            disabled={attending}
                            onClick={() => {
                              setAttend("Present");
                              handleAttendance("Present", subj, schedule);
                            }}
                          />
                          <Button
                            title={AttendingStatus("Absent")}
                            disabled={attending}
                            onClick={() => {
                              setAttend("Absent");
                              handleAttendance("Absent", subj, schedule);
                            }}
                          />
                          <Button
                            title={AttendingStatus("Canceled")}
                            disabled={attending}
                            onClick={() => {
                              setAttend("Canceled");
                              handleAttendance("Canceled", subj, schedule);
                            }}
                          />
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {subj.schedules?.map((schedule) => {
            const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
            if (editingkey !== key) return null;

            return (
              <div
                key={key}
                className="modal-overlay"
                onClick={() => setEditingKey(null)}
              >
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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
                        data,
                      );
                      if (success) setEditingKey(null);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
